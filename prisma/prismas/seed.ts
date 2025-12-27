// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (opcional - comentar en producción)
  console.log('🗑️  Limpiando datos existentes...');
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.recharge.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // ============================================
  // USUARIOS
  // ============================================
  console.log('👥 Creando usuarios...');

  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  const userPassword = await bcrypt.hash('User123!', 12);
  const affiliatePassword = await bcrypt.hash('Affiliate123!', 12);

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@luffystreaming.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
      status: 'ACTIVE',
      wallet: 0,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // Usuario Regular
  const user1 = await prisma.user.create({
    data: {
      email: 'user@luffystreaming.com',
      password: userPassword,
      name: 'Usuario Demo',
      phone: '+51987654321',
      role: 'USER',
      status: 'ACTIVE',
      wallet: 50.00,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Usuario creado:', user1.email);

  // Afiliado
  const affiliate = await prisma.user.create({
    data: {
      email: 'affiliate@luffystreaming.com',
      password: affiliatePassword,
      name: 'Afiliado Demo',
      phone: '+51912345678',
      role: 'AFFILIATE',
      status: 'ACTIVE',
      wallet: 25.00,
      referralCode: 'AFF001',
      totalCommissions: 0,
      pendingCommissions: 0,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Afiliado creado:', affiliate.email);

  // Usuario referido por afiliado
  const user2 = await prisma.user.create({
    data: {
      email: 'juan.perez@example.com',
      password: userPassword,
      name: 'Juan Pérez',
      role: 'USER',
      status: 'ACTIVE',
      wallet: 20.00,
      referredBy: affiliate.id,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Usuario referido creado:', user2.email);

  // Más usuarios de ejemplo
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'maria.garcia@example.com',
        password: userPassword,
        name: 'María García',
        role: 'USER',
        status: 'ACTIVE',
        wallet: 15.00,
      },
    }),
    prisma.user.create({
      data: {
        email: 'carlos.rodriguez@example.com',
        password: userPassword,
        name: 'Carlos Rodríguez',
        role: 'USER',
        status: 'ACTIVE',
        wallet: 30.00,
        referredBy: affiliate.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'ana.martinez@example.com',
        password: userPassword,
        name: 'Ana Martínez',
        role: 'AFFILIATE',
        status: 'PENDING',
        wallet: 0,
        referralCode: 'AFF002',
      },
    }),
  ]);
  console.log(`✅ ${users.length} usuarios adicionales creados`);

  // ============================================
  // PRODUCTOS
  // ============================================
  console.log('📦 Creando productos...');

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Netflix Premium',
        slug: 'netflix-premium',
        description: 'Cuenta Netflix Premium con 4 pantallas simultáneas, calidad 4K Ultra HD. Duración: 1 mes.',
        provider: 'MISTERSHIFU',
        priceUSD: 3.10,
        pricePEN: 11.35,
        stock: 50,
        sold: 15,
        category: 'Streaming',
        deliveryType: 'AUTOMATIC',
        status: 'ACTIVE',
        featured: true,
        image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800',
        metaTitle: 'Netflix Premium - 1 Mes',
        metaDescription: 'Disfruta de Netflix Premium con 4 pantallas en HD',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Spotify Premium',
        slug: 'spotify-premium',
        description: 'Spotify Premium sin anuncios, música sin límites, calidad alta. Duración: 1 mes.',
        provider: 'MUSICWORLD',
        priceUSD: 2.50,
        pricePEN: 9.15,
        stock: 75,
        sold: 32,
        category: 'Música',
        deliveryType: 'AUTOMATIC',
        status: 'ACTIVE',
        featured: true,
        image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800',
        metaTitle: 'Spotify Premium - 1 Mes',
        metaDescription: 'Música sin límites con Spotify Premium',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Disney+ Premium',
        slug: 'disney-plus-premium',
        description: 'Disney+ con acceso a todo el catálogo, 4 dispositivos, calidad 4K. Duración: 1 mes.',
        provider: 'STREAMKING',
        priceUSD: 4.00,
        pricePEN: 14.64,
        stock: 30,
        sold: 8,
        category: 'Streaming',
        deliveryType: 'MANUAL',
        status: 'ACTIVE',
        featured: false,
        image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800',
        metaTitle: 'Disney+ Premium - 1 Mes',
        metaDescription: 'Todo el contenido de Disney+ en tu pantalla',
      },
    }),
    prisma.product.create({
      data: {
        name: 'HBO Max',
        slug: 'hbo-max',
        description: 'HBO Max con todo el catálogo de películas y series. Duración: 1 mes.',
        provider: 'STREAMKING',
        priceUSD: 3.50,
        pricePEN: 12.81,
        stock: 40,
        sold: 12,
        category: 'Streaming',
        deliveryType: 'AUTOMATIC',
        status: 'ACTIVE',
        featured: false,
        image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Amazon Prime Video',
        slug: 'amazon-prime-video',
        description: 'Prime Video con películas, series y contenido exclusivo. Duración: 1 mes.',
        provider: 'PRIMESTORE',
        priceUSD: 3.00,
        pricePEN: 10.98,
        stock: 25,
        sold: 5,
        category: 'Streaming',
        deliveryType: 'AUTOMATIC',
        status: 'ACTIVE',
        featured: false,
        image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800',
      },
    }),
    prisma.product.create({
      data: {
        name: 'YouTube Premium',
        slug: 'youtube-premium',
        description: 'YouTube sin anuncios, con YouTube Music incluido. Duración: 1 mes.',
        provider: 'VIDEOPLUS',
        priceUSD: 2.80,
        pricePEN: 10.25,
        stock: 60,
        sold: 20,
        category: 'Streaming',
        deliveryType: 'AUTOMATIC',
        status: 'ACTIVE',
        featured: true,
        image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Crunchyroll Premium',
        slug: 'crunchyroll-premium',
        description: 'Crunchyroll Premium con anime sin anuncios, simulcasts y más. Duración: 1 mes.',
        provider: 'ANIMEWORLD',
        priceUSD: 2.00,
        pricePEN: 7.32,
        stock: 45,
        sold: 18,
        category: 'Anime',
        deliveryType: 'AUTOMATIC',
        status: 'ACTIVE',
        featured: false,
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Canva Pro',
        slug: 'canva-pro',
        description: 'Canva Pro con acceso a todas las herramientas de diseño premium. Duración: 1 mes.',
        provider: 'DESIGNTOOLS',
        priceUSD: 5.00,
        pricePEN: 18.30,
        stock: 20,
        sold: 7,
        category: 'Diseño',
        deliveryType: 'MANUAL',
        status: 'ACTIVE',
        featured: false,
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
      },
    }),
  ]);
  console.log(`✅ ${products.length} productos creados`);

  // ============================================
  // PEDIDOS
  // ============================================
  console.log('🛒 Creando pedidos...');

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'LFS-2025-0001',
      userId: user1.id,
      subtotal: 5.60,
      discount: 0,
      total: 5.60,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      paidAt: new Date(),
      completedAt: new Date(),
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            priceUSD: 3.10,
            pricePEN: 11.35,
            subtotal: 3.10,
            productName: products[0].name,
            productProvider: products[0].provider,
            deliveryType: products[0].deliveryType,
            delivered: true,
            deliveredAt: new Date(),
          },
          {
            productId: products[1].id,
            quantity: 1,
            priceUSD: 2.50,
            pricePEN: 9.15,
            subtotal: 2.50,
            productName: products[1].name,
            productProvider: products[1].provider,
            deliveryType: products[1].deliveryType,
            delivered: true,
            deliveredAt: new Date(),
          },
        ],
      },
    },
  });

  // Pedido de usuario referido (genera comisión)
  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'LFS-2025-0002',
      userId: user2.id,
      subtotal: 4.00,
      discount: 0,
      total: 4.00,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      affiliateId: affiliate.id,
      commissionAmount: 0.40, // 10% de 4.00
      commissionPaid: false,
      paidAt: new Date(),
      completedAt: new Date(),
      items: {
        create: [
          {
            productId: products[2].id,
            quantity: 1,
            priceUSD: 4.00,
            pricePEN: 14.64,
            subtotal: 4.00,
            productName: products[2].name,
            productProvider: products[2].provider,
            deliveryType: products[2].deliveryType,
            delivered: true,
            deliveredAt: new Date(),
          },
        ],
      },
    },
  });

  // Crear comisión para el afiliado
  await prisma.commission.create({
    data: {
      affiliateId: affiliate.id,
      orderId: order2.id,
      orderTotal: 4.00,
      commissionRate: 0.10,
      amount: 0.40,
      status: 'PENDING',
    },
  });

  console.log(`✅ Pedidos creados`);

  // ============================================
  // RECARGAS
  // ============================================
  console.log('💰 Creando recargas...');

  await prisma.recharge.create({
    data: {
      userId: user1.id,
      amount: 30.00,
      status: 'PENDING',
      paymentMethod: 'Transferencia Bancaria',
      paymentReference: 'TRX-123456',
      notificationSent: true,
      notificationAt: new Date(),
    },
  });

  await prisma.recharge.create({
    data: {
      userId: user2.id,
      amount: 20.00,
      status: 'APPROVED',
      paymentMethod: 'Yape',
      paymentReference: 'YAPE-789012',
      approvedBy: admin.id,
      approvedAt: new Date(),
    },
  });

  console.log(`✅ Recargas creadas`);

  // ============================================
  // CONFIGURACIÓN DEL SISTEMA
  // ============================================
  console.log('⚙️  Configurando sistema...');

  await prisma.systemConfig.createMany({
    data: [
      {
        key: 'SITE_NAME',
        value: 'Luffy Streaming',
        description: 'Nombre del sitio',
      },
      {
        key: 'COMMISSION_RATE',
        value: '0.10',
        description: 'Tasa de comisión para afiliados (10%)',
      },
      {
        key: 'USD_TO_PEN_RATE',
        value: '3.66',
        description: 'Tipo de cambio USD a PEN',
      },
      {
        key: 'WHATSAPP_NUMBER',
        value: '51946559632',
        description: 'Número de WhatsApp para notificaciones',
      },
      {
        key: 'MAX_LOGIN_ATTEMPTS',
        value: '5',
        description: 'Intentos máximos de login antes de bloqueo',
      },
      {
        key: 'LOGIN_LOCK_DURATION',
        value: '15',
        description: 'Duración de bloqueo en minutos',
      },
    ],
  });

  console.log(`✅ Configuración del sistema creada`);

  // ============================================
  // LOGS DE AUDITORÍA
  // ============================================
  console.log('📝 Creando logs de auditoría...');

  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'LOGIN',
        entity: 'users',
        entityId: admin.id,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
      },
      {
        userId: user1.id,
        action: 'ORDER_CREATED',
        entity: 'orders',
        entityId: order1.id,
        ipAddress: '127.0.0.1',
      },
    ],
  });

  console.log(`✅ Logs de auditoría creados`);

  console.log('\n✨ Seed completado exitosamente!\n');
  console.log('📊 Resumen:');
  console.log(`   👥 Usuarios: ${await prisma.user.count()}`);
  console.log(`   📦 Productos: ${await prisma.product.count()}`);
  console.log(`   🛒 Pedidos: ${await prisma.order.count()}`);
  console.log(`   💰 Recargas: ${await prisma.recharge.count()}`);
  console.log(`   💼 Comisiones: ${await prisma.commission.count()}`);
  console.log('\n🔐 Credenciales de acceso:');
  console.log('   Admin: admin@luffystreaming.com / Admin123!');
  console.log('   Usuario: user@luffystreaming.com / User123!');
  console.log('   Afiliado: affiliate@luffystreaming.com / Affiliate123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });