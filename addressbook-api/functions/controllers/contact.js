const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();
const db= admin.firestore();


const contactApp = express();
contactApp.use(cors({origin: true}));

contactApp.get("/", async (request, response) => {
  const snapshot = await db.collection("contacts").get();
  const contacts = [];
  snapshot.forEach((doc) =>{
    const id = doc.id;
    const data = doc.data();

    contacts.push({id, ...data});
  });

  response.status(200).send(JSON.stringify(contacts));
});

contactApp.get("/:id", async (req, res)=>{
  const snapshot = await db.collection("contacts")
      .doc(req.params.id).get();

  const contactId = snapshot.id;
  const contactData = snapshot.data();

  res.status(200).send(JSON.stringify({id: contactId, ...contactData}));
});

contactApp.put("/:id", async (req, res) => {
  const body = req.body;
  await db.collection("contacts").doc(req.params.id).update({
    ...body,
  });
  res.status(200).send(JSON.stringify(body));
});

contactApp.delete("/:id", async (req, res)=>{
  await db.collection("contacts").doc(req.params.id).delete();
  res.status(200).send();
});


contactApp.post("/", async (request, response) => {
  const contact = request.body;
  await db.collection("contacts").add(contact);
  response.status(201).send(JSON.stringify(contact));
});


exports.contact = functions.https.onRequest(contactApp);

