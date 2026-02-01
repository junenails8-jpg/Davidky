// ==================== config.js ====================
// 【职责】所有配置数据：常量、文本、服务、员工
// 【修改指南】
//   - 改文字/翻译 → 修改 TEXTS
//   - 改价格/服务 → 修改 SERVICES  
//   - 改员工名单 → 修改 STAFF
//   - 改球速度 → 修改 CONFIG 物理常量

// 物理常量
const CONFIG = {
  TARGET_SCORE: 20,
  GRAVITY: 0.6,           // ← 改这里调整重力
  AIR_FRICTION: 0.995,    // ← 改这里调整空气阻力  
  GROUND_FRICTION: 0.85,  // ← 改这里调整地面摩擦
  TILT_FORCE: 1.2,        // ← 改这里调整手机倾斜灵敏度
  BOUNCE: 0.65,           // ← 改这里调整弹跳高度
  GROUND_Y_OFFSET: 150
};

// 多语言文本
const TEXTS = {
  zh: {
    buttonBook: '预约',
    buttonGift: 'GIFT',
    buttonServices: '服务',
    buttonMember: '会员',
    bookingTitle: '📅 在线预约',
    selectTime: '📅 选择预约时间',
    selectService: '💅 选择服务项目',
    selectStaff: '👤 选择指定技师（可选）',
    contactInfo: '📞 联系方式',
    monthLabel: '月份',
    dayLabel: '日期',
    timeLabel: '时间',
    monthSuffix: '月',
    daySuffix: '日',
    anyStaff: '任意技师',
    confirmBooking: '确认预约',
    ok: '确定',
    bookingSuccess: '✅ 预约成功！',
    bookingError: '⚠️ 提示',
    selectTimeFirst: '请先选择预约时间',
    alreadyBooked: '已被预约，请选择其他时间',
    serviceSelected: '已选择',
    promoTitle: '🎁 恭喜！',
    promoSubtitle: '您获得了专属优惠',
    contacts: ['📱 (516) 371-4557', '💬 (917) 330-5781', '📍 97 Doughty Blvd Inwood NY 11096', '⏰ 周二至周日 9:58-18:58']
  },
  en: {
    buttonBook: 'Book',
    buttonGift: 'GIFT',
    buttonServices: 'Services',
    buttonMember: 'Member',
    bookingTitle: '📅 Book Appointment',
    selectTime: '📅 Select Time',
    selectService: '💅 Select Service',
    selectStaff: '👤 Select Staff (Optional)',
    contactInfo: '📞 Contact',
    monthLabel: 'Month',
    dayLabel: 'Day',
    timeLabel: 'Time',
    monthSuffix: '',
    daySuffix: '',
    anyStaff: 'Any Staff',
    confirmBooking: 'Confirm Booking',
    ok: 'OK',
    bookingSuccess: '✅ Booking Successful!',
    bookingError: '⚠️ Notice',
    selectTimeFirst: 'Please select time first',
    alreadyBooked: 'is already booked, please choose another time',
    serviceSelected: 'Selected',
    promoTitle: '🎁 Congratulations!',
    promoSubtitle: 'You got an exclusive offer',
    contacts: ['📱 (516) 371-4557', '💬 (917) 330-5781', '📍 97 Doughty Blvd Inwood NY 11096', '⏰ Tue-Sun 9:58-18:58']
  },
  es: {
    buttonBook: 'Reservar',
    buttonGift: 'REGALO',
    buttonServices: 'Servicios',
    buttonMember: 'Miembro',
    bookingTitle: '📅 Reservar Cita',
    selectTime: '📅 Seleccionar Tiempo',
    selectService: '💅 Seleccionar Servicio',
    selectStaff: '👤 Seleccionar Técnico (Opcional)',
    contactInfo: '📞 Contacto',
    monthLabel: 'Mes',
    dayLabel: 'Día',
    timeLabel: 'Hora',
    monthSuffix: '',
    daySuffix: '',
    anyStaff: 'Cualquier Técnico',
    confirmBooking: 'Confirmar Reserva',
    ok: 'OK',
    bookingSuccess: '✅ ¡Reserva Exitosa!',
    bookingError: '⚠️ Aviso',
    selectTimeFirst: 'Por favor seleccione el tiempo primero',
    alreadyBooked: 'ya está reservado, elija otro tiempo',
    serviceSelected: 'Seleccionado',
    promoTitle: '¡Felicitaciones!',
    promoSubtitle: 'Obtuvo una oferta exclusiva',
    contacts: ['📱 (516) 371-4557', '💬 (917) 330-5781', '📍 97 Doughty Blvd Inwood NY 11096', '⏰ Mar-Dom 9:58-18:58']
  }
};

// 员工数据（← 改这里增删员工）
const STAFF = [
  { id: 0, name: 'any' },
  { id: 1, name: 'Amy' },
  { id: 2, name: 'Lisa' },
  { id: 3, name: 'Jenny' },
  { id: 4, name: 'Sarah' }
];

// 服务数据（← 改这里增删服务、调整价格）
const SERVICES = {
  manicure: [
    { name: 'Regular Mani', price: '$12', nameZh: '经典美甲', nameEs: 'Manicure Regular' },
    { name: 'Color Gel Mani', price: '$30', nameZh: '凝胶美甲', nameEs: 'Gel de Color' },
    { name: 'Powder Gel Mani', price: '$45', nameZh: '粉雕美甲', nameEs: 'Gel en Polvo' }
  ],
  pedicure: [
    { name: 'Regular Pedi', price: '$22', nameZh: '经典美足', nameEs: 'Pedicure Regular' },
    { name: 'Color Gel Pedi', price: '$40', nameZh: '凝胶美足', nameEs: 'Gel de Color Pedi' }
  ],
  spa: [
    { name: 'Basic Mani', price: '$22', nameZh: 'SPA美甲', nameEs: 'SPA Mani' },
    { name: 'Basic Pedi', price: '$40', nameZh: 'SPA美足', nameEs: 'SPA Pedi' },
    { name: 'Deluxe Pedi', price: '$55', nameZh: '豪华美足', nameEs: 'Pedicure de Lujo' },
    { name: 'Hot Stone', price: '$80', nameZh: '热石按摩', nameEs: 'Piedra Caliente' },
    { name: 'Jelly', price: '$90', nameZh: 'Jelly SPA', nameEs: 'Jelly SPA' }
  ]
};
