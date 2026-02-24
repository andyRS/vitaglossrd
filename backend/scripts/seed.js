require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const User = require('../models/User')

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB conectado')

    // Verificar si ya hay usuarios
    const count = await User.countDocuments()
    if (count > 0) {
      console.log(`⚠️  Ya existen ${count} usuario(s). No se creó nada.`)
      console.log('   Para resetear, borra los usuarios desde MongoDB Atlas.')
      process.exit(0)
    }

    // Crear primer admin
    const admin = await User.create({
      nombre: 'Admin VitaGloss',
      email: 'admin@vitagloss.com',
      password: 'admin123456',   // ← Cambia esto después del primer login
      rol: 'admin',
      whatsapp: '18492763532',
      descripcion: 'Fundador y distribuidor principal de VitaGloss RD.',
      metaMensual: 25000,
    })

    console.log('🎉 Usuario admin creado:')
    console.log('   Email:', admin.email)
    console.log('   Password: admin123456  ← ¡Cambia esto inmediatamente!')
    console.log('   Rol:', admin.rol)
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seed()
