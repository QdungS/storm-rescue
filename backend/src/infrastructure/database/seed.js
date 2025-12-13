import { connectDatabase, disconnectDatabase } from './mongoose/connection.js';
import { UserModel } from './mongoose/models/UserModel.js';
import { LandslidePointModel } from './mongoose/models/LandslidePointModel.js';
import { WarningModel } from './mongoose/models/WarningModel.js';
import { SafetyGuideModel } from './mongoose/models/SafetyGuideModel.js';
import { SafeZoneModel } from './mongoose/models/SafeZoneModel.js';
import { EmergencyContactModel } from './mongoose/models/EmergencyContactModel.js';
import { hashPassword } from '../../shared/utils/password.js';
import { ROLES, USER_STATUS, REPORT_STATUS, WARNING_LEVEL } from '../../shared/constants/roles.js';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to database
    await connectDatabase();

    // Clear existing data
    await UserModel.deleteMany({});
    await LandslidePointModel.deleteMany({});
    await WarningModel.deleteMany({});
    await SafetyGuideModel.deleteMany({});
    await SafeZoneModel.deleteMany({});
    await EmergencyContactModel.deleteMany({});

    console.log('✓ Cleared existing data');

    // Create users
    const adminPassword = await hashPassword('123456');
    const officerPassword = await hashPassword('123456');
    const citizenPassword = await hashPassword('123456');

    const admin = await UserModel.create({
      name: 'Quản Trị Viên',
      email: 'admin@tlu.edu.vn',
      password: adminPassword,
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE
    });

    const officer = await UserModel.create({
      name: 'Cán Bộ Xã A',
      email: 'canbo@tlu.edu.vn',
      password: officerPassword,
      role: ROLES.OFFICER,
      status: USER_STATUS.ACTIVE
    });

    const citizen = await UserModel.create({
      name: 'Nguyễn Văn Dân',
      email: 'dan@gmail.com',
      password: citizenPassword,
      role: ROLES.CITIZEN,
      status: USER_STATUS.ACTIVE,
      savedLocations: [
        {
          name: 'Nhà riêng',
          type: 'home',
          lat: 20.7833,
          lng: 105.3833,
          address: 'Xã A, Huyện Cao Phong'
        },
        {
          name: 'Cơ quan',
          type: 'work',
          lat: 20.95,
          lng: 105.6,
          address: 'TP. Hòa Bình'
        }
      ]
    });

    console.log('✓ Created users');

    // Create landslide points
    await LandslidePointModel.create([
      {
        name: 'Dốc Cun - Hòa Bình',
        lat: 20.7833,
        lng: 105.3833,
        level: 5,
        description: 'Khu vực đất yếu, thường xuyên sạt lở khi mưa lớn.',
        status: 'Nguy hiểm cao',
        updatedAt: new Date('2024-12-08')
      },
      {
        name: 'Đèo Thung Khe',
        lat: 20.6953,
        lng: 105.2394,
        level: 2,
        description: 'Đã gia cố kè đá, đang theo dõi.',
        status: 'An toàn',
        updatedAt: new Date('2024-12-01')
      }
    ]);

    console.log('✓ Created landslide points');

    // Create warnings
    await WarningModel.create([
      {
        title: 'CẢNH BÁO KHẨN CẤP: Dốc Cun',
        content: 'Mưa lớn kéo dài, nguy cơ sạt lở đất đá rất cao tại Km 78+500. Người dân tuyệt đối không di chuyển qua khu vực này.',
        level: WARNING_LEVEL.URGENT,
        location: 'Dốc Cun - Hòa Bình'
      },
      {
        title: 'Lưu ý di chuyển: Đèo Thung Khe',
        content: 'Sương mù dày đặc kèm mưa nhỏ, đường trơn trượt. Các phương tiện chú ý giảm tốc độ.',
        level: WARNING_LEVEL.WARNING,
        location: 'Đèo Thung Khe'
      }
    ]);

    console.log('✓ Created warnings');

    // Create safety guides
    await SafetyGuideModel.create([
      {
        title: 'Kỹ năng sinh tồn khi xảy ra sạt lở đất',
        category: 'Kỹ năng',
        content: 'Khi nghe tiếng nổ lớn hoặc thấy cây cối nghiêng, hãy chạy ngay ra khỏi khu vực nguy hiểm theo hướng vuông góc với hướng sạt lở. Tuyệt đối không trú ẩn dưới gầm cầu thang hoặc các công trình yếu.'
      },
      {
        title: 'Bộ quy tắc ứng phó trước mùa mưa bão',
        category: 'Tài liệu',
        content: '1. Gia cố nhà cửa. 2. Chuẩn bị túi cứu thương. 3. Lưu số điện thoại khẩn cấp. 4. Theo dõi bản đồ cảnh báo thường xuyên.'
      }
    ]);

    console.log('✓ Created safety guides');

    // Create safe zones
    await SafeZoneModel.create([
      {
        name: 'Trường THPT Hòa Bình',
        address: 'Số 10, Đường Lê Lợi, TP. Hòa Bình',
        capacity: '500 người',
        status: 'Sẵn sàng',
        lat: 20.8133,
        lng: 105.3383
      },
      {
        name: 'Nhà văn hóa Xã A',
        address: 'Thôn 2, Xã A, Huyện Cao Phong',
        capacity: '200 người',
        status: 'Đang sửa chữa',
        lat: 20.7833,
        lng: 105.3833
      }
    ]);

    console.log('✓ Created safe zones');

    // Create emergency contacts
    await EmergencyContactModel.create([
      {
        name: 'Cứu hộ cứu nạn tỉnh',
        phone: '114'
      },
      {
        name: 'Y tế khẩn cấp',
        phone: '115'
      },
      {
        name: 'Ban chỉ huy phòng chống thiên tai',
        phone: '0218 385 1234'
      }
    ]);

    console.log('✓ Created emergency contacts');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test accounts:');
    console.log('   Admin: admin@tlu.edu.vn / 123456');
    console.log('   Officer: canbo@tlu.edu.vn / 123456');
    console.log('   Citizen: dan@gmail.com / 123456');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seedData();

