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

/* CLIENTS DB */

/* Getting all clients without exposing their password hash */
app.get("/clients", async (_req, res) => {
  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        username: true,
        parentName: true,
        phone: true,
        email: true,
        kidName: true,
        kidAge: true,
        createdAt: true,
      },
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

/* Getting one client without exposing the password hash */
app.get("/clients/:id", async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        username: true,
        parentName: true,
        phone: true,
        email: true,
        kidName: true,
        kidAge: true,
        createdAt: true,
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

/* Creating a new client and adding it to the table */
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
      res.status(400).json({
        message: "יש למלא את כל שדות החובה",
      });
      return;
    }

    const existingClient = await prisma.client.findFirst({
      where: {
        OR: [{ id }, { username }],
      },
    });

    if (existingClient) {
      res.status(409).json({
        message: "תעודת הזהות או שם המשתמש כבר קיימים במערכת",
      });
      return;
    }

    const numericKidAge = Number(kidAge);

    if (!Number.isInteger(numericKidAge) || numericKidAge < 0) {
      res.status(400).json({
        message: "גיל הילד חייב להיות מספר שלם וחיובי",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newClient= await prisma.client.create({
      data: {
        id: id.trim(),
        username: username.trim(),
        passwordHash,
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        kidName: kidName.trim(),
        kidAge: numericKidAge,
      },
    });

    res.status(201).json({
      message: "המשתמש נוצר בהצלחה",
      client: {
        id: newClient.id,
        username: newClient.username,
        parentName: newClient.parentName,
        phone: newClient.phone,
        email: newClient.email,
        kidName: newClient.kidName,
        kidAge: newClient.kidAge,
      },
    });
  } catch (error) {
    console.error("Failed to create client:", error);

    res.status(500).json({
      message: "לא הצלחנו ליצור את המשתמש",
    });
  }
});

/* Checking the username and password and logging the client in */
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        message: "יש למלא שם משתמש וסיסמה",
      });
      return;
    }

    const client = await prisma.client.findUnique({
      where: {
        username: username.trim(),
      },
    });

    if (!client) {
      res.status(401).json({
        message: "שם המשתמש או הסיסמה אינם נכונים",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      client.passwordHash,
    );

    if (!isPasswordCorrect) {
      res.status(401).json({
        message: "שם המשתמש או הסיסמה אינם נכונים",
      });
      return;
    }

    res.json({
      message: "התחברת בהצלחה",
      client: {
        id: client.id,
        username: client.username,
        parentName: client.parentName,
        phone: client.phone,
        email: client.email,
        kidName: client.kidName,
        kidAge: client.kidAge,
      },
    });
  } catch (error) {
    console.error("Failed to login:", error);

    res.status(500).json({
      message: "לא הצלחנו להתחבר",
    });
  }
});


/*Updating an existing client that its id ia a parameter in the url of the webpage
  the url tells which obj is making the action and
  the body tells what to change in
*/
app.patch("/clients/:id", async (req, res) => {
  try {
    const {
      username,
      password,
      parentName,
      phone,
      email,
      kidName,
      kidAge,
    } = req.body;

    if (
      username !== undefined &&
      (typeof username !== "string" || !username.trim())
    ) {
      res.status(400).json({
        message: "Username cannot be empty",
      });
      return;
    }

    if (
      parentName !== undefined &&
      (typeof parentName !== "string" || !parentName.trim())
    ) {
      res.status(400).json({
        message: "Parent name cannot be empty",
      });
      return;
    }

    if (
      phone !== undefined &&
      (typeof phone !== "string" || !phone.trim())
    ) {
      res.status(400).json({
        message: "Phone cannot be empty",
      });
      return;
    }

    if (
      kidName !== undefined &&
      (typeof kidName !== "string" || !kidName.trim())
    ) {
      res.status(400).json({
        message: "Kid name cannot be empty",
      });
      return;
    }

    const numericKidAge =
      kidAge !== undefined ? Number(kidAge) : undefined;

    if (
      numericKidAge !== undefined &&
      (!Number.isInteger(numericKidAge) || numericKidAge < 0)
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

    if (username !== undefined) {
      const clientWithSameUsername = await prisma.client.findUnique({
        where: {
          username: username.trim(),
        },
      });

      if (
        clientWithSameUsername &&
        clientWithSameUsername.id !== req.params.id
      ) {
        res.status(409).json({
          message: "Username already exists",
        });
        return;
      }
    }

    const passwordHash =
      password !== undefined
        ? await bcrypt.hash(password, 10)
        : undefined;

    const updatedClient = await prisma.client.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...(username !== undefined && {
          username: username.trim(),
        }),
        ...(passwordHash !== undefined && {
          passwordHash,
        }),
        ...(parentName !== undefined && {
          parentName: parentName.trim(),
        }),
        ...(phone !== undefined && {
          phone: phone.trim(),
        }),
        ...(email !== undefined && {
          email: email?.trim() || null,
        }),
        ...(kidName !== undefined && {
          kidName: kidName.trim(),
        }),
        ...(numericKidAge !== undefined && {
          kidAge: numericKidAge,
        }),
      },
      select: {
        id: true,
        username: true,
        parentName: true,
        phone: true,
        email: true,
        kidName: true,
        kidAge: true,
        createdAt: true,
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

/* Removing the client whose id is a parameter from the DB */
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

/* LESSONS DB */

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

/* REGISTRATIONS DB */
app.post("/registrations", async (req, res) => {//configuring an endpoint named registrations in the server
  try {
    const { clientId, lessonId } = req.body;

    if (!clientId || !Number.isInteger(lessonId)) {
      res.status(400).json({
        message: "Missing or invalid registration details",
      });
      return;
    }

    const client = await prisma.client.findUnique({//getting the client that want to register from DB
      where: {
        id: clientId,
      },
    });

    if (!client) {
      res.status(404).json({
        message: "Client not found",
      });
      return;
    }

    const lesson = await prisma.lesson.findUnique({//getting the lesson that the client wants to register to from DB
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

    const existingRegistration =
      await prisma.registration.findUnique({
        where: {
          clientId_lessonId: {
            clientId,
            lessonId,
          },
        },
      });

    if (existingRegistration) {
      res.status(409).json({
        message: "המשתמש כבר רשום לחוג הזה",
      });
      return;
    }

    const registration = await prisma.registration.create({
      data: {
        clientId,
        lessonId,
      },
    });

    res.status(201).json({
      message: "נרשמת בהצלחה לחוג",
      registration,
    });
  } catch (error) {
    console.error("Failed to create registration:", error);

    res.status(500).json({
      message: "לא הצלחנו לבצע את ההרשמה",
    });
  }
});



/* Activates the server. Without listen, the server is not working */
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