import express from 'express';
import { Event,  Event_Details } from '../models.js';
import multer from "multer";
import { authenticateToken } from '../middleware.js';

const router = express.Router(); 
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("LIMIT_FILE_TYPE"));
        }
    }
});

const toImageObject = (file) => ({
  data: file.buffer,
  contentType: file.mimetype,
  fileName: file.originalname,
});

router.post('/add', upload.single("poster"), authenticateToken, async (req,res)=>{
  try {
    const { title, date, time, venue, status, activityPoints, rate, registrationLink, OwnerId, role, a_desc } = req.body;
    const OwnerModel = role === 'Admin' ? 'Admin_User' : 'Soc_User';

    const newEvent = new Event({
      title, date, time, venue, status, activityPoints, rate, registrationLink, OwnerId, OwnerModel
    });
    await newEvent.save();
    
    const newDetails = new Event_Details({
      EventId: newEvent._id,
      a_desc: a_desc || "",
      poster: req.file ? toImageObject(req.file) : null,
    });

    await newDetails.save();

    res.status(201).json({ msg: 'Event and details created successfully!' });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while adding event.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, status, activityPoints, rate, ownerType, ownerName } = req.query; 
    
    let query = {};  
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (activityPoints && activityPoints !== 'All') {
      query.activityPoints = activityPoints === 'Yes';
    }
    if (rate && rate !== 'All') {
      if (rate === 'Free') query.rate = 0;
      if (rate === 'Priced') query.rate = { $gt: 0 };
    }

    const events = await Event.find(query).populate('OwnerId');

    let processedEvents = [];
    for (let event of events) {
      const details = await Event_Details.findOne({ EventId: event._id });
      
      const owner = event.OwnerId || {};
      let currentOwnerName = '';
      let currentOwnerType = '';

      if (event.OwnerModel === 'Admin_User') {
        currentOwnerName = 'MBCET';
        currentOwnerType = 'College';
      }
      else {
        currentOwnerName = owner.name;
        currentOwnerType = owner.category;
      }

      if (ownerType && ownerType !== 'All' && currentOwnerType !== ownerType) continue;
      if (ownerName && ownerName !== 'All' && currentOwnerName !== ownerName) continue;

      const formattedEvent = {
        ...event.toObject(),
        id: event._id,
        rate: event.rate,
        ownerName: currentOwnerName, 
        ownerType: currentOwnerType,
        details: details || {}
      };

      processedEvents.push(formattedEvent);
    }

    res.json(processedEvents);
  }
  catch (err) {
    res.status(500).json({ msg: 'Server error while fetching events.' });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("OwnerId");

    if (!event)
      return res.status(404).json({ msg: "Event not found." });

    const details = await Event_Details.findOne({ EventId: event._id });
    const owner = event.OwnerId || {};

    res.json({
      ...event.toObject(),
      id: event._id,
      ownerName: event.OwnerModel === "Admin_User" ? "MBCET" : owner.name || "",
      ownerType:
        event.OwnerModel === "Admin_User" ? "College" : owner.category || "",
      details: {
        a_desc: details?.a_desc || "",
        p_desc: details?.p_desc || "",
        hasPoster: Boolean(details?.poster?.data),
        imageCount: details?.images?.length || 0,
      },
    });
  }
  catch (err) {
    res.status(500).json({ msg: "Server error while fetching event." });
  }
});

router.get("/:id/poster", async (req,res)=>{
  try {
    const details = await Event_Details.findOne({
        EventId:req.params.id
    });

    if(!details || !details.poster)
        return res.status(404).send("No poster");

    res.set("Content-Type",details.poster.contentType);

    res.send(details.poster.data);
  }
  catch (err) {
    res.status(500).send("Unable to load poster.");
  }
});

router.get("/:id/images/:imageIndex", async (req, res) => {
  try {
    const details = await Event_Details.findOne({ EventId: req.params.id });
    const image = details?.images?.[Number(req.params.imageIndex)];

    if (!image?.data) return res.status(404).send("Image not found.");

    res.set("Content-Type", image.contentType);
    res.send(image.data);
  }
  catch (err) {
    res.status(500).send("Unable to load image.");
  }
});

router.put('/update-active/:id', authenticateToken, upload.single("poster"), async (req, res) => {
  try {
    const eventId = req.params.id;
    const { a_desc, ...eventData } = req.body; 

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      eventData,
      { new: true } 
    );

    if (!updatedEvent) {
      return res.status(404).json({ msg: 'Event not found.' });
    }

    let details = await Event_Details.findOne({ EventId: eventId });
    if (a_desc !== undefined)
      details.a_desc = a_desc;
    if (req.file) 
      details.poster = toImageObject(req.file);
    
    await details.save();

    res.json({ msg: 'Event updated successfully!' });
  }
  catch (err) {
    res.status(500).json({ msg: 'Server error while updating event.' });
  }
});

router.put('/status-past/:id', authenticateToken, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      { status: 'Past' }, 
      { new: true }
    );

    if (!updatedEvent)
      return res.status(404).json({ msg: 'Event not found.' });

    let details = await Event_Details.findOne({ EventId: req.params.id });

    if (!details) {
      details = new Event_Details({ EventId: req.params.id });
    }

    if (!details.p_desc) details.p_desc = details.a_desc || "";

    if ((!details.images || details.images.length === 0) && details.poster?.data) {
      details.images = [details.poster];
    }

    await details.save();

    res.json({ msg: 'Event status changed to Past!', event: updatedEvent });
  }
  catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ msg: 'Server error while updating status.' });
  }
});

router.put('/update-past/:id', authenticateToken, upload.array("images", 10), async (req, res) => {
  try {
    const { p_desc } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found." });

    let details = await Event_Details.findOne({ EventId: event._id });

    if (!details) {
      details = new Event_Details({ EventId: event._id });
    }

    if (p_desc !== undefined) details.p_desc = p_desc;

    if (req.files?.length) {
      const newImages = req.files.map(toImageObject);
      details.images = [...(details.images || []), ...newImages];
    }

    await details.save();

    res.json({ msg: 'Past event details saved successfully!' });
  }
  catch (err) {
    res.status(500).json({ msg: 'Server error while saving details.' });
  }
});

router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found.' });
    }

    await Event_Details.findOneAndDelete({ EventId: eventId });
    await Event.findByIdAndDelete(eventId);
    

    res.json({ msg: 'Event deleted successfully!' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error while deleting event.' });
  }
});

export default router;
