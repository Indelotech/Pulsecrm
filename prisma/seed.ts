import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function monthsAgo(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

async function main() {
  const password = await hash("password123", 12);
  const existingUser = await prisma.user.findUnique({
    where: { email: "demo@pulsecrm.app" },
    select: { id: true, companyId: true }
  });

  let companyId = existingUser?.companyId;

  if (!companyId) {
    const company = await prisma.company.create({
      data: {
        name: "Pulse Demo Co.",
        plan: "Growth",
        monthlyTarget: 85000
      }
    });

    companyId = company.id;
  } else {
    await prisma.$transaction([
      prisma.note.deleteMany({ where: { companyId } }),
      prisma.task.deleteMany({ where: { companyId } }),
      prisma.activity.deleteMany({ where: { companyId } }),
      prisma.lead.deleteMany({ where: { companyId } }),
      prisma.customer.deleteMany({ where: { companyId } }),
      prisma.company.update({
        where: { id: companyId },
        data: { name: "Pulse Demo Co.", plan: "Growth", monthlyTarget: 85000 }
      })
    ]);
  }

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: "Demo Owner",
          email: "demo@pulsecrm.app",
          password,
          companyId
        }
      })
    : await prisma.user.create({
        data: {
          name: "Demo Owner",
          email: "demo@pulsecrm.app",
          password,
          companyId
        }
      });

  const [northstar, riverbend, atlas, craft] = await Promise.all([
    prisma.customer.create({
      data: {
        companyId,
        name: "Avery Brooks",
        email: "avery@northstar.example",
        phone: "+1 415 555 0198",
        companyName: "Northstar Supply",
        status: "ACTIVE",
        source: "Referral",
        lifetimeValue: 42000
      }
    }),
    prisma.customer.create({
      data: {
        companyId,
        name: "Mina Patel",
        email: "mina@riverbend.example",
        phone: "+1 312 555 0144",
        companyName: "Riverbend Foods",
        status: "ACTIVE",
        source: "Website",
        lifetimeValue: 28000
      }
    }),
    prisma.customer.create({
      data: {
        companyId,
        name: "Theo Martin",
        email: "theo@atlas.example",
        phone: "+1 646 555 0161",
        companyName: "Atlas Retail Group",
        status: "PROSPECT",
        source: "Trade show",
        lifetimeValue: 9000
      }
    }),
    prisma.customer.create({
      data: {
        companyId,
        name: "Elena Cruz",
        email: "elena@craft.example",
        phone: "+1 206 555 0182",
        companyName: "Craft & Co.",
        status: "INACTIVE",
        source: "Partner",
        lifetimeValue: 12000
      }
    })
  ]);

  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        companyId,
        name: "Jordan Lee",
        email: "jordan@keystone.example",
        phone: "+1 720 555 0110",
        companyName: "Keystone Logistics",
        status: "NEW",
        value: 18000,
        source: "Outbound",
        expectedClose: daysFromNow(18)
      }
    }),
    prisma.lead.create({
      data: {
        companyId,
        name: "Samira Okafor",
        email: "samira@meridian.example",
        phone: "+1 404 555 0145",
        companyName: "Meridian Clinics",
        status: "CONTACTED",
        value: 26000,
        source: "Webinar",
        expectedClose: daysFromNow(25)
      }
    }),
    prisma.lead.create({
      data: {
        companyId,
        name: "Lucas Chen",
        email: "lucas@apex.example",
        phone: "+1 949 555 0188",
        companyName: "Apex Workshop",
        status: "QUALIFIED",
        value: 39000,
        source: "Referral",
        expectedClose: daysFromNow(9)
      }
    }),
    prisma.lead.create({
      data: {
        companyId,
        name: "Nora Ellis",
        email: "nora@greenfield.example",
        phone: "+1 512 555 0119",
        companyName: "Greenfield Studio",
        status: "WON",
        value: 32000,
        source: "Inbound",
        expectedClose: monthsAgo(1),
        updatedAt: monthsAgo(1)
      }
    }),
    prisma.lead.create({
      data: {
        companyId,
        name: "Owen Hayes",
        email: "owen@harbor.example",
        phone: "+1 503 555 0189",
        companyName: "Harbor Analytics",
        status: "WON",
        value: 47000,
        source: "Partner",
        expectedClose: monthsAgo(2),
        updatedAt: monthsAgo(2)
      }
    })
  ]);

  await Promise.all([
    prisma.task.create({
      data: {
        companyId,
        title: "Send renewal options",
        description: "Prepare the updated annual agreement and include support hours.",
        dueDate: daysFromNow(2),
        status: "IN_PROGRESS",
        priority: "HIGH",
        customerId: northstar.id,
        assigneeId: user.id
      }
    }),
    prisma.task.create({
      data: {
        companyId,
        title: "Book discovery call",
        description: "Confirm business goals and implementation timeline.",
        dueDate: daysFromNow(1),
        status: "PENDING",
        priority: "HIGH",
        leadId: leads[2].id,
        assigneeId: user.id
      }
    }),
    prisma.task.create({
      data: {
        companyId,
        title: "Follow up on quote",
        description: "Mina asked for procurement-friendly payment terms.",
        dueDate: daysFromNow(5),
        status: "PENDING",
        priority: "MEDIUM",
        customerId: riverbend.id,
        assigneeId: user.id
      }
    }),
    prisma.task.create({
      data: {
        companyId,
        title: "Archive old onboarding checklist",
        description: "Keep the customer file tidy after the new process rollout.",
        dueDate: daysFromNow(12),
        status: "COMPLETED",
        priority: "LOW",
        customerId: craft.id,
        assigneeId: user.id
      }
    })
  ]);

  await Promise.all([
    prisma.note.create({
      data: {
        companyId,
        customerId: northstar.id,
        body: "Avery wants a consolidated renewal proposal with implementation milestones and a support retainer."
      }
    }),
    prisma.note.create({
      data: {
        companyId,
        customerId: atlas.id,
        body: "Theo is evaluating whether a small pilot can start before the full retail rollout."
      }
    }),
    prisma.note.create({
      data: {
        companyId,
        leadId: leads[2].id,
        body: "Lucas confirmed budget and decision-maker access. Send technical implementation notes before Friday."
      }
    }),
    prisma.note.create({
      data: {
        companyId,
        leadId: leads[0].id,
        body: "Jordan responded to the outbound email and asked for pricing tiers."
      }
    })
  ]);

  await Promise.all([
    prisma.activity.create({
      data: {
        companyId,
        type: "CUSTOMER",
        title: "Customer added",
        detail: northstar.name,
        createdAt: daysFromNow(-5)
      }
    }),
    prisma.activity.create({
      data: {
        companyId,
        type: "LEAD",
        title: "Lead qualified",
        detail: leads[2].name,
        createdAt: daysFromNow(-3)
      }
    }),
    prisma.activity.create({
      data: {
        companyId,
        type: "DEAL",
        title: "Deal won",
        detail: `${leads[3].companyName} · $32,000`,
        createdAt: daysFromNow(-2)
      }
    }),
    prisma.activity.create({
      data: {
        companyId,
        type: "TASK",
        title: "Task created",
        detail: "Send renewal options",
        createdAt: daysFromNow(-1)
      }
    }),
    prisma.activity.create({
      data: {
        companyId,
        type: "NOTE",
        title: "Customer note added",
        detail: riverbend.name
      }
    })
  ]);

  console.log("Seeded demo account: demo@pulsecrm.app / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
