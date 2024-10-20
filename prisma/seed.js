import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Step 1: Clear existing data (except users)
  await prisma.attendance.deleteMany({});
  await prisma.reward.deleteMany({});
  await prisma.scheduleParticipants.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.department.deleteMany({});

  console.log("Cleared existing data.");

  // Step 2: Create Departments
  const departments = [
    "Contact Centre",
    "Retail Banking",
    "Corporate Banking",
    "Investment Banking",
    "Treasury",
    "Information Technology (IT)",
    "Operations",
    "Risk Management",
    "Human Resources (HR)",
  ];

  const createdDepartments = await Promise.all(
    departments.map(async (name) => {
      return await prisma.department.create({ data: { name } });
    })
  );

  console.log("Departments created.");

  // Step 3: Create Teams with Department IDs
  const teamsData = [
    // Teams for Contact Centre
    { name: "Email", departmentId: createdDepartments[0].id },
    { name: "Inbound & Video Banking", departmentId: createdDepartments[0].id },
    { name: "Outbound", departmentId: createdDepartments[0].id },
    { name: "Chats", departmentId: createdDepartments[0].id },
    { name: "Resolution", departmentId: createdDepartments[0].id },
    { name: "QA", departmentId: createdDepartments[0].id },

    // Teams for Retail Banking
    { name: "Branch Operations", departmentId: createdDepartments[1].id },
    { name: "Customer Service", departmentId: createdDepartments[1].id },
    { name: "Personal Loans", departmentId: createdDepartments[1].id },
    { name: "Mortgage Services", departmentId: createdDepartments[1].id },
    { name: "Deposit Products", departmentId: createdDepartments[1].id },
    { name: "E-Banking Services", departmentId: createdDepartments[1].id },

    // Teams for Corporate Banking
    { name: "Relationship Management", departmentId: createdDepartments[2].id },
    { name: "Trade Finance", departmentId: createdDepartments[2].id },
    { name: "Corporate Loans", departmentId: createdDepartments[2].id },
    { name: "Cash Management", departmentId: createdDepartments[2].id },
    {
      name: "Treasury and Investment Services",
      departmentId: createdDepartments[2].id,
    },

    // Teams for Investment Banking
    { name: "Corporate Finance", departmentId: createdDepartments[3].id },
    { name: "Asset Management", departmentId: createdDepartments[3].id },
    { name: "Mergers & Acquisitions", departmentId: createdDepartments[3].id },
    { name: "Capital Markets", departmentId: createdDepartments[3].id },
    { name: "Structured Finance", departmentId: createdDepartments[3].id },

    // Teams for Treasury
    { name: "Liquidity Management", departmentId: createdDepartments[4].id },
    {
      name: "Foreign Exchange (FX) Trading",
      departmentId: createdDepartments[4].id,
    },
    {
      name: "Bonds and Securities Trading",
      departmentId: createdDepartments[4].id,
    },
    { name: "Investment Strategy", departmentId: createdDepartments[4].id },

    // Teams for IT
    {
      name: "Infrastructure Management",
      departmentId: createdDepartments[5].id,
    },
    { name: "Network Security", departmentId: createdDepartments[5].id },
    { name: "Software Development", departmentId: createdDepartments[5].id },
    { name: "Database Management", departmentId: createdDepartments[5].id },
    { name: "IT Support/Help Desk", departmentId: createdDepartments[5].id },

    // Teams for Operations
    { name: "Payment Processing", departmentId: createdDepartments[6].id },
    { name: "Reconciliation", departmentId: createdDepartments[6].id },
    { name: "Funds Transfer", departmentId: createdDepartments[6].id },
    { name: "ATM Operations", departmentId: createdDepartments[6].id },
    { name: "Clearing and Settlement", departmentId: createdDepartments[6].id },

    // Teams for Risk Management
    { name: "Credit Risk", departmentId: createdDepartments[7].id },
    { name: "Market Risk", departmentId: createdDepartments[7].id },
    { name: "Operational Risk", departmentId: createdDepartments[7].id },
    { name: "Compliance Risk", departmentId: createdDepartments[7].id },
    {
      name: "Fraud Detection and Prevention",
      departmentId: createdDepartments[7].id,
    },

    // Teams for HR
    {
      name: "Recruitment & Talent Acquisition",
      departmentId: createdDepartments[8].id,
    },
    {
      name: "Learning and Development",
      departmentId: createdDepartments[8].id,
    },
    {
      name: "Payroll and Compensation",
      departmentId: createdDepartments[8].id,
    },
    { name: "Employee Relations", departmentId: createdDepartments[8].id },
    { name: "Performance Management", departmentId: createdDepartments[8].id },
    { name: "HR Business Partners", departmentId: createdDepartments[8].id },
  ];

  await prisma.team.createMany({ data: teamsData });

  const createdTeams = await prisma.team.findMany();

  console.log("Teams created.");

  // Step 4: Create Categories
  const categories = [
    { name: "Performance", description: "Evaluation of employee performance." },
    {
      name: "Collaboration",
      description: "Rewards for collaborative efforts.",
    },
    {
      name: "Attendance",
      description: "Recognition for consistent attendance.",
    },
    {
      name: "Customer Feedback",
      description: "Rewards based on customer feedback.",
    },
  ];

  const createdCategories = await Promise.all(
    categories.map((category) => prisma.category.create({ data: category }))
  );

  console.log("Categories created.");

  // Step 5: Create Random Nigerian Employees
  const nigerianStates = [
    "Lagos",
    "Abuja",
    "Kano",
    "Oyo",
    "Rivers",
    "Anambra",
    "Kaduna",
    "Ogun",
    "Edo",
    "Enugu",
  ];

  const nigerianCities = [
    "Lagos",
    "Abuja",
    "Ibadan",
    "Kano",
    "Port Harcourt",
    "Onitsha",
    "Abeokuta",
    "Benin City",
    "Enugu",
    "Kaduna",
  ];

  const employeesData = Array.from({ length: 15 }).map(() => {
    const officeLocation = faker.helpers.arrayElement(["Hybrid", "Onsite"]);
    const randomTeam = faker.helpers.arrayElement(createdTeams); // Randomly select a team
    return {
      profilePic:
        "https://i.pravatar.cc/150?img=" +
        faker.number.int({ min: 1, max: 70 }), // Using valid image URL
      firstName: faker.person.firstName(), // Nigerian male names
      lastName: faker.person.lastName(), // Nigerian last names
      mobileNumber: faker.phone.number("+234##########"), // Nigerian phone numbers
      emailAddress: faker.internet.email(),
      dateOfBirth: faker.date.past(30).toISOString(),
      maritalStatus: faker.helpers.arrayElement(["Single", "Married"]),
      gender: faker.helpers.arrayElement(["Male", "Female"]),
      nationality: "Nigerian",
      address: faker.location.streetAddress(),
      city: faker.helpers.arrayElement(nigerianCities), // Nigerian cities
      state: faker.helpers.arrayElement(nigerianStates), // Nigerian states
      zipCode: faker.location.zipCode(),
      workingDays: faker.number.int({ min: 1, max: 7 }),
      startDate: faker.date.past(1).toISOString(),
      officeLocation: officeLocation,
      offerLetter: faker.internet.url(),
      payrollSlip: faker.internet.url(),
      cv: faker.internet.url(),
      meansOfId: faker.helpers.arrayElement([
        "National ID",
        "Voter ID",
        "Driver License",
      ]),
      teamId: randomTeam.id, // Assign team ID
      departmentId: randomTeam.departmentId, // Set department ID from team
    };
  });

  const employees = await Promise.all(
    employeesData.map((employee) => prisma.employee.create({ data: employee }))
  );

  console.log("Nigerian Employees created.");

  // Step 6: Assign Team Leads (One employee per team)
  for (const team of createdTeams) {
    const teamEmployees = employees.filter((emp) => emp.teamId === team.id);
    if (teamEmployees.length > 0) {
      const teamLead = faker.helpers.arrayElement(teamEmployees);

      await prisma.team.update({
        where: { id: team.id },
        data: { teamLeadId: teamLead.id },
      });

      console.log(
        `Assigned ${teamLead.firstName} ${teamLead.lastName} as team lead for ${team.name}.`
      );
    }
  }

  console.log("Team leads assigned.");

  // Step 7: Create Schedules
  const scheduleDates = [
    faker.date.future(0.1), // Future date for the next few weeks
    faker.date.future(0.2),
    faker.date.future(0.3),
  ];

  for (const date of scheduleDates) {
    const schedule = await prisma.schedule.create({
      data: {
        title: `Schedule for ${faker.date.month()}`,
        startTime: new Date(
          faker.date.between({ from: new Date(), to: new Date(date) })
        ).toISOString(),
        endTime: new Date(
          faker.date.between({
            from: date,
            to: new Date(date.getTime() + 2 * 60 * 60 * 1000),
          })
        ).toISOString(), // 2 hours after start
        location: faker.location.city(),
      },
    });

    // Create scheduleParticipants entries
    await prisma.scheduleParticipants.createMany({
      data: employees.map((employee) => ({
        employeeId: employee.id,
        scheduleId: schedule.id,
      })),
    });

    console.log(`Created schedule: ${schedule.title}`);
  }

  // Step 8: Create a Single Attendance Record for Each Employee
  for (const employee of employees) {
    const randomHour = faker.number.int({ min: 7, max: 10 });
    const randomMinute = faker.number.int({ min: 0, max: 59 });
    const checkInTime = new Date(2023, 0, 1, randomHour, randomMinute); // Set to a specific date for simplicity

    const status = checkInTime.getHours() >= 8 ? "Late" : "On Time";
    const type = employee.officeLocation === "Hybrid" ? "Hybrid" : "Onsite";

    await prisma.attendance.create({
      data: {
        checkIn: checkInTime,
        employeeId: employee.id,
        teamId: employee.teamId,
        status,
        type,
      },
    });
  }

  console.log("Attendance records created for employees.");

  // Step 9: Create Random Rewards for Employees
  for (const employee of employees) {
    const randomCategoryIndex = Math.floor(
      Math.random() * createdCategories.length
    ); // Get valid index for categories

    await prisma.reward.create({
      data: {
        employeeId: employee.id,
        earnedDate: new Date(),
        categoryId: createdCategories[randomCategoryIndex].id,
        pointsEarned: Math.floor(Math.random() * 100),
        progress: Math.min(Math.random() * 100, 100), // Ensure progress is capped at 100
        departmentId: employee.departmentId, // Set department ID from employee
      },
    });
  }
  console.log("Rewards created for employees.");

  // Step 10: Create Announcements
  const announcementsData = [
    {
      title: "Quarterly Town Hall Meeting",
      description:
        "Join us for the quarterly town hall meeting to discuss our achievements and future goals.",
    },
    {
      title: "New Health Benefits",
      description:
        "We are excited to announce new health benefits for all employees. Please check your email for details.",
    },
    {
      title: "Holiday Schedule",
      description:
        "Please note the upcoming public holidays and plan your work accordingly.",
    },
  ];

  for (const announcement of announcementsData) {
    await prisma.announcement.create({
      data: {
        title: announcement.title,
        description: announcement.description,
        date: faker.date.recent().toISOString(),
        isPinned: false,
        createdAt: new Date(),
      },
    });

    console.log(`Created announcement: ${announcement.title}`);
  }

  console.log("Announcements created.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
