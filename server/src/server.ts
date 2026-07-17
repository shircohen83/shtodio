import "dotenv/config";
import cors from "cors";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcrypt";

/*This file activates the server (like app.tsx activates the client) */


const app = express();/*express is a framework that builds a server (instead of us creating a https server from scratch) */
const PORT = 3000;

const adapter = new PrismaBetterSqlite3({/*prisma knows how to talk to the DB in SQLite, this is an opening of a connection to the DB*/
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

app.use(cors());/*cors adds the needed permissions so that the FE could call the server */
app.use(express.json());/*makes every request that comes in json format to become a JS obj so that we could do req.body*/

app.get("/", (_req, res) => {
  res.json({ message: "SHtodio server is running" });
});

app.get("/clients", async (_req, res) => {
  try {
    const clients = await prisma.client.findMany({/*ask prisma to bring all the clients fom client table.
                                                Each request to the server takes time therefor the async and await */
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(clients);/*res is the answer that is sent to the front in json format */
  } catch (error) {
    console.error("Failed to get clients:", error);

    res.status(500).json({/*internal Server Error */
      message: "Failed to get clients",
    });
  }
});

app.get("/clients/:id", async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!client) {
      res.status(404).json({
        message: "Client not found",
      });
      return;
    }

    res.json(client);
  } catch (error) {
    console.error("Failed to get client:", error);

    res.status(500).json({
      message: "Failed to get client",
    });
  }
});

/*Creating a new client and adding to the table */
app.post("/clients", async (req, res) => {
  try {
    const {
      id,
      username,
      password,
      parentName,
      phone,
      email,
      kidName,
      kidAge,
    } = req.body;

    if (
      !id ||
      !username ||
      !password ||
      !parentName ||
      !phone ||
      !kidName ||
      kidAge === undefined
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const existingClient = await prisma.client.findFirst({
      where: {
        OR: [{ id }, { username }],
      },
    });

    if (existingClient) {
      return res.status(409).json({
        message: "Client already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const client = await prisma.client.create({
      data: {
        id,
        username,
        passwordHash,
        parentName,
        phone,
        email: email || null,
        kidName,
        kidAge: Number(kidAge),
      },
    });

    res.status(201).json({message: "Client created successfully",});
  } catch (error) {
    console.error("Failed to create client:", error);

    res.status(500).json({
      message: "Failed to create client",
    });
  }
});

/*Updating an existing client that its id ia a parameter in the url of the webpage
  the url tells which obj is making the action and
  the body tells what to change in
*/
app.patch("/clients/:id", async (req, res) => {
  try {
    const { fullName, phone, email, kidAge } = req.body;

    if (
      fullName !== undefined &&
      (typeof fullName !== "string" || !fullName.trim())
    ) {
      res.status(400).json({
        message: "Full name cannot be empty",
      });
      return;
    }

    if (
      kidAge !== undefined &&
      kidAge !== null &&
      (!Number.isInteger(kidAge) || kidAge < 0)
    ) {
      res.status(400).json({
        message: "Kid age must be a positive whole number",
      });
      return;
    }

    const existingClient = await prisma.client.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!existingClient) {
      res.status(404).json({
        message: "Client not found",
      });
      return;
    }

    const updatedClient = await prisma.client.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...(fullName !== undefined && {
          fullName: fullName.trim(),
        }),
        ...(phone !== undefined && {
          phone: phone?.trim() || null,
        }),
        ...(email !== undefined && {
          email: email?.trim() || null,
        }),
        ...(kidAge !== undefined && {
          kidAge,
        }),
      },
    });

    res.json(updatedClient);
  } catch (error) {
    console.error("Failed to update client:", error);

    res.status(500).json({
      message: "Failed to update client",
    });
  }
});

/*Removing the client that it's id is a parameter from DB */
app.delete("/clients/:id", async (req, res) => {
  try {
    const existingClient = await prisma.client.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!existingClient) {
      res.status(404).json({
        message: "Client not found",
      });
      return;
    }

    await prisma.client.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete client:", error);

    res.status(500).json({
      message: "Failed to delete client",
    });
  }
});


/*LESSONS DB */
app.get("/lessons", async (_req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: [
        {
          day: "asc",
        },
        {
          startHour: "asc",
        },
      ],
    });

    res.json(lessons);
  } catch (error) {
    console.error("Failed to get lessons:", error);

    res.status(500).json({
      message: "Failed to get lessons",
    });
  }
});

app.get("/lessons/:id", async (req, res) => {
  try {
    const lessonId = Number(req.params.id);

    if (!Number.isInteger(lessonId)) {
      res.status(400).json({
        message: "Invalid lesson ID",
      });
      return;
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      res.status(404).json({
        message: "Lesson not found",
      });
      return;
    }

    res.json(lesson);
  } catch (error) {
    console.error("Failed to get lesson:", error);

    res.status(500).json({
      message: "Failed to get lesson",
    });
  }
});

app.post("/lessons", async (req, res) => {
  try {
    const {
      lessonType,
      title,
      description,
      day,
      startHour,
      duration,
    } = req.body;

    if (
      !lessonType ||
      !title ||
      !description ||
      !Number.isInteger(day) ||
      !Number.isInteger(startHour) ||
      typeof duration !== "number"
    ) {
      res.status(400).json({
        message: "Missing or invalid lesson details",
      });
      return;
    }

    const lesson = await prisma.lesson.create({
      data: {
        lessonType,
        title,
        description,
        day,
        startHour,
        duration,
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error("Failed to create lesson:", error);

    res.status(500).json({
      message: "Failed to create lesson",
    });
  }
});


/*Activates the server, without 'listen' the server is not working */
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const closeServer = async () => {
  await prisma.$disconnect();

  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);