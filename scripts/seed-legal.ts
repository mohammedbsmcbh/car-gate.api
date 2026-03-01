
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CONTENT = {
  about_us: {
    en: `
# About Car Gate

Welcome to **Car Gate**, the premier digital automotive marketplace connecting buyers, sellers, agencies, and showrooms in one seamless ecosystem.

**Our Mission**
To simplify the vehicle trading process by providing a transparent, secure, and efficient platform for all automotive needs.

**What We Offer**
- **Verified Listings:** We ensure quality and trust in every vehicle listed.
- **Showroom Integration:** Digital storefronts for authorized dealerships.
- **Agency Services:** Comprehensive support for customs, papers, and inspections.
- **Secure Communication:** Built-in chat and inquiry systems.

Whether you are looking for your dream car, selling your current vehicle, or managing a fleet, Car Gate is your trusted partner on the road.
    `,
    ar: `
# عن كار جيت (Car Gate)

مرحباً بكم في **كار جيت**، السوق الرقمي الأول للسيارات الذي يربط بين البائعين والمشترين والوكالات والمعارض في نظام بيئي واحد متكامل.

**رسالتنا**
تسهيل عملية تجارة المركبات من خلال توفير منصة شفافة وآمنة وفعالة لجميع احتياجات السيارات.

**ماذا نقدم؟**
- **إعلانات موثقة:** نضمن الجودة والثقة في كل مركبة معروضة.
- **دمج المعارض:** واجهات رقمية للمعارض المعتمدة.
- **خدمات الوكالات:** دعم شامل للتخليص الجمركي والأوراق والفحوصات.
- **تواصل آمن:** أنظمة دردشة واستعلام مدمجة.

سواء كنت تبحث عن سيارة أحلامك، أو تبيع مركبتك الحالية، أو تدير أسطولاً، فإن كار جيت هو شريكك الموثوق على الطريق.
    `,
    ur: `
# کار گیٹ (Car Gate) کے بارے میں

**کار گیٹ** میں خوش آمدید، ایک ممتاز ڈیجیٹل آٹوموٹو مارکیٹ پلیس جو خریداروں، فروخت کنندگان، ایجنسیوں اور شورومز کو ایک ہموار نظام میں جوڑتا ہے۔

**ہمارا مشن**
گاڑیوں کی تجارت کے عمل کو آسان بنانا اور گاڑیوں کی تمام ضروریات کے لیے ایک شفاف، محفوظ اور موثر پلیٹ فارم فراہم کرنا۔

**ہم کیا پیش کرتے ہیں**
- **تصدیق شدہ لسٹنگ:** ہم ہر درج شدہ گاڑی میں معیار اور اعتماد کو یقینی بناتے ہیں۔
- **شوروم انٹیگریشن:** مجاز ڈیلرشپ کے لیے ڈیجیٹل اسٹور فرنٹ۔
- **ایجنسی خدمات:** کسٹم، کاغذات اور معائنے کے لیے جامع مدد۔
- **محفوظ مواصلات:** بلٹ ان چیٹ اور انکوائری سسٹم۔

چاہے آپ اپنی پسندیدہ کار تلاش کر رہے ہوں، اپنی موجودہ گاڑی بیچ رہے ہوں، یا فلیٹ کا انتظام کر رہے ہوں، کار گیٹ سڑک پر آپ کا قابل اعتماد ساتھی ہے۔
    `
  },
  terms_conditions: {
    en: `
# Terms and Conditions

**Last Updated: January 2025**

**1. Introduction**
Welcome to Car Gate. By accessing or using our mobile application and website, you agree to be bound by these Terms and Conditions.

**2. User Accounts**
- You are responsible for maintaining the confidentiality of your account.
- You must provide accurate and current information.
- We reserve the right to terminate accounts that violate our policies.

**3. Listing Rules**
- All vehicle information must be accurate.
- Misleading photos or descriptions are strictly prohibited.
- We reserve the right to remove non-compliant listings.

**4. Fees and Payments**
- Certain features (like Featured Listings) may incur fees.
- All fees are non-refundable unless stated otherwise.
- Prices are subject to change with notice.

**5. Liability**
Car Gate acts as an intermediary and is not responsible for the condition of vehicles or the actions of buyers/sellers off-platform.

**6. Contact**
For any legal questions, please contact support@cargate.com.
    `,
    ar: `
# الشروط والأحكام

**آخر تحديث: يناير 2025**

**1. المقدمة**
مرحباً بكم في كار جيت. بمجرد استخدامك لتطبيقنا أو موقعنا الإلكتروني، فإنك توافق على الالتزام بهذه الشروط والأحكام.

**2. حسابات المستخدمين**
- أنت مسؤول عن الحفاظ على سرية حسابك.
- يجب تقديم معلومات دقيقة وحديثة.
- نحتفظ بالحق في إنهاء الحسابات التي تنتهك سياساتنا.

**3. قواعد الإعلان**
- يجب أن تكون جميع معلومات المركبة دقيقة.
- يمنع منعاً باتاً استخدام صور أو أوصاف مضللة.
- نحتفظ بالحق في إزالة الإعلانات غير المطابقة.

**4. الرسوم والدفع**
- قد تترتب رسوم على بعض الميزات (مثل الإعلانات المميزة).
- جميع الرسوم غير قابلة للاسترداد ما لم ينص على خلاف ذلك.
- الأسعار قابلة للتغيير مع إشعار مسبق.

**5. المسؤولية**
تعمل كار جيت كوسيط وليست مسؤولة عن حالة المركبات أو تصرفات البائعين/المشترين خارج المنصة.

**6. التواصل**
لأي استفسارات قانونية، يرجى التواصل مع support@cargate.com.
    `,
    ur: `
# شرائط و ضوابط

**آخری تازہ کاری: جنوری 2025**

**1. تعارف**
کار گیٹ میں خوش آمدید۔ ہماری موبائل ایپلیکیشن اور ویب سائٹ تک رسائی حاصل کرکے یا استعمال کرکے، آپ ان شرائط و ضوابط کے پابند ہونے سے اتفاق کرتے ہیں۔

**2. صارف کے اکاؤنٹس**
- آپ اپنے اکاؤنٹ کی رازداری برقرار رکھنے کے ذمہ دار ہیں۔
- آپ کو درست اور موجودہ معلومات فراہم کرنی ہوں گی۔
- ہم ان اکاؤنٹس کو ختم کرنے کا حق محفوظ رکھتے ہیں جو ہماری پالیسیوں کی خلاف ورزی کرتے ہیں۔

**3. لسٹنگ کے اصول**
- گاڑی کی تمام معلومات درست ہونی چاہئیں۔
- گمراہ کن تصاویر یا تفصیلات سختی سے منع ہیں۔
- ہم غیر تعمیل شدہ لسٹنگ کو ہٹانے کا حق محفوظ رکھتے ہیں۔

**4. فیس اور ادائیگیاں**
- کچھ خصوصیات (جیسے نمایاں لسٹنگ) پر فیس لاگو ہوسکتی ہے۔
- تمام فیس ناقابل واپسی ہیں جب تک کہ دوسری صورت میں بیان نہ کیا گیا ہو۔
- قیمتیں نوٹس کے ساتھ تبدیل ہوسکتی ہیں۔

**5. ذمہ داری**
کار گیٹ ایک ثالث کے طور پر کام کرتا ہے اور گاڑیوں کی حالت یا پلیٹ فارم سے باہر خریداروں/فروخت کنندگان کے اعمال کا ذمہ دار نہیں ہے۔

**6. رابطہ**
کسی بھی قانونی سوالات کے لیے، براہ کرم support@cargate.com پر رابطہ کریں۔
    `
  },
  privacy_policy: {
    en: `
# Privacy Policy

**1. Data Collection**
We collect information you provide directly to us, such as when you create an account, list a car, or communicate with other users.

**2. How We Use Data**
- To facilitate vehicle transactions.
- To improve our services and AI recommendations.
- To ensure platform safety and prevent fraud.

**3. Information Sharing**
We do not sell your personal data. We only share data with service providers (e.g., payment processors) necessary to operate the app.

**4. User Rights**
You have the right to access, correct, or delete your personal data at any time via the app settings.

**5. Security**
We implement industry-standard security measures to protect your information.
    `,
    ar: `
# سياسة الخصوصية

**1. جمع البيانات**
نحن نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب، أو عرض سيارة للبيع، أو التواصل مع مستخدمين آخرين.

**2. كيف نستخدم البيانات**
- لتسهيل عمليات بيع وشراء المركبات.
- لتحسين خدماتنا وتوصيات الذكاء الاصطناعي.
- لضمان أمان المنصة ومنع الاحتيال.

**3. مشاركة المعلومات**
نحن لا نبيع بياناتك الشخصية. نشارك البيانات فقط مع مقدمي الخدمات (مثل معالجي الدفع) الضروريين لتشغيل التطبيق.

**4. حقوق المستخدم**
لديك الحق في الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها في أي وقت عبر إعدادات التطبيق.

**5. الأمان**
نحن نطبق معايير الأمان المعتمدة في الصناعة لحماية معلوماتك.
    `,
    ur: `
# رازداری کی پالیسی

**1. ڈیٹا اکٹھا کرنا**
ہم وہ معلومات اکٹھا کرتے ہیں جو آپ براہ راست ہمیں فراہم کرتے ہیں، جیسے کہ جب آپ اکاؤنٹ بناتے ہیں، کار کی فہرست بناتے ہیں، یا دوسرے صارفین کے ساتھ بات چیت کرتے ہیں۔

**2. ہم ڈیٹا کا استعمال کیسے کرتے ہیں**
- گاڑیوں کے لین دین کو آسان بنانے کے لیے۔
- ہماری خدمات اور AI سفارشات کو بہتر بنانے کے لیے۔
- پلیٹ فارم کی حفاظت کو یقینی بنانے اور دھوکہ دہی کو روکنے کے لیے۔

**3. معلومات کا اشتراک**
ہم آپ کا ذاتی ڈیٹا فروخت نہیں کرتے ہیں۔ ہم صرف سروس فراہم کرنے والوں (مثلاً پیمنٹ پروسیسرز) کے ساتھ ڈیٹا شیئر کرتے ہیں جو ایپ کو چلانے کے لیے ضروری ہیں۔

**4. صارف کے حقوق**
آپ کو ایپ کی ترتیبات کے ذریعے کسی بھی وقت اپنے ذاتی ڈیٹا تک رسائی، تصحیح یا حذف کرنے کا حق ہے۔

**5. سیکیورٹی**
ہم آپ کی معلومات کی حفاظت کے لیے انڈسٹری کے معیاری حفاظتی اقدامات نافذ کرتے ہیں۔
    `
  }
};

async function main() {
  console.log('🌱 Seeding Legal Content...');

  for (const [key, value] of Object.entries(CONTENT)) {
    console.log(`Processing ${key}...`);
    
    // Convert object to JSON string
    const jsonValue = JSON.stringify(value);
    
    await prisma.systemSetting.upsert({
      where: { key },
      create: {
        key,
        value: jsonValue,
        description: `Legal Content for ${key} (Trilingual JSON)`
      },
      update: {
        value: jsonValue,
        description: `Legal Content for ${key} (Trilingual JSON)`
      }
    });
  }

  console.log('✅ Legal Content Seeded Successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
