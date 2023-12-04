const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose
    .connect("mongodb+srv://aidmcc88:dzrn36ej@cluster0.gmtl9ec.mongodb.net/")
    .then(() => {
        console.log("Connected to mongodb")
    })
    .catch((error) => console.log("Couldn't connect to mongodb", error));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const titanSchema = new mongoose.Schema({
    name:String,
    class:String,
    weapon:String,
    ability1:String,
    ability2:String,
    ability3:String,
    img:String
});

const Titan = mongoose.model("Titan", titanSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let titans = [
    {
        _id: 1,
        name: "Ion",
        class: "Atlas",
        weapon: "Splitter Rifle",
        ability1: "Laser Shot: shoots a fast, powerful laser beam.",
        ability2: "Vortex Shield: Absorbs incoming projectiles and releases them back at enemies.",
        ability3: "Tripwire: Deploys explosive mines that detonate when enemies pass through.",
        img: "images/img1.jpg"
    },
    {
        _id: 2,
        name: "Scorch",
        class: "Ogre",
        weapon: "T-203 Thermite Launcher",
        ability1: "Firewall: Creates a line of fire that damages enemies who pass through it.",
        ability2: "Incendiary Trap: Deploys canisters that release thermite gas when shot.",
        ability3: "Heat Shield: Activates a defensive shield that blocks incoming fire.",
        img: "images/img2.jpg"
    },
    {
        _id: 3,
        name: "Northstar",
        class: "Stryder",
        weapon: "Plasma Railgun",
        ability1: "Cluster Missile: Launches a missile that releases smaller explosive projectiles upon impact.",
        ability2: "VTOL Hover: Allows Northstar to hover in the air for a short duration.",
        ability3: "Tether Traps: Deploys traps that, when triggered, immobilize and damage enemies.",
        img: "images/img3.jpg"
    },
    {
        _id: 4,
        name: "Ronin",
        class: "Stryder",
        weapon: "Leadwall Shotgun",
        ability1: "Sword Block: Reduces incoming damage by blocking with a sword.",
        ability2: "Phase Dash: Quickly teleports in the direction of movement.",
        ability3: "Arc Wave: Sends out a wave of energy that damages and slows enemies.",
        img: "images/img4.jpg"
    },
    {
        _id: 5,
        name: "Tone",
        class: "Atlas",
        weapon: "40mm Tracker Cannon",
        ability1: "Tracker Rockets: Fires tracking rockets at locked-on targets.",
        ability2: "Sonar Lock: Detects and highlights enemies in a certain area.",
        ability3: "Particle Wall: Deploys a defensive energy barrier that blocks incoming fire.",
        img: "images/img5.jpg"
    }
];

app.get("/api/titans", (req, res) => {
    res.send(titans);
});

app.post("/api/titans", upload.single("img"), (req, res) => {
    const result = validateTitan(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const titan = {
        _id: titans.length + 1,
        name: req.body.name,
        class: req.body.class,
        weapon: req.body.weapon,
        ability1: req.body.ability1,
        ability2: req.body.ability2,
        ability3: req.body.ability3
    };

    if(req.file) {
        titan.img = "images/" + req.file.filename;
    }

    titans.push(titan);
    res.send(titans);
});

const validateTitan = (titan) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        class: Joi.string().min(3).required(),
        weapon: Joi.string().min(3).required(),
        ability1: Joi.string().min(5),
        ability2: Joi.string().min(5),
        ability3: Joi.string().min(5),
        img: Joi.allow(""),
    });

    return schema.validate(titan);
};

app.put("/api/titans/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);
    const titan = titans.find((r) => r._id === id);
    const result = validateTitan(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    titan.name = req.body.name;
    titan.class = req.body.class;
    titan.weapon = req.body.weapon;
    titan.ability1 = req.body.ability1;
    titan.ability2 = req.body.ability2;
    titan.ability3 = req.body.ability3;

    if (req.file) {
        titan.img = "images/" + req.file.filename;
    }

    // Send the updated Titan list as a response
    res.send(titans);
});

app.delete("/api/titans/:id", (req, res) => {
    const titanIndex = titans.findIndex(a => a._id == parseInt(req.params.id));
    if (titanIndex > -1) {
        titans.splice(titanIndex, 1);
        res.send(titans);
    } else {
        res.status(404).send('Titan not found');
    }
});

app.listen(3003, () => {
    console.log("I'm listening");
});