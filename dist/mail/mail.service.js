"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const PRIMARY = '#143B62';
const YELLOW = '#F5C400';
const BG = '#F4F7FF';
const TEXT = '#1a2340';
const MUTED = '#6B7A99';
const WHITE = '#FFFFFF';
const APP_URL = 'https://cargate.bh';
function emailWrapper(bodyContent) {
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:${BG};font-family:'Segoe UI',Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:${PRIMARY};border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
              <div style="display:inline-block;background:${YELLOW};border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;text-align:center;margin-bottom:12px;">🚗</div>
              <h1 style="color:${WHITE};margin:0;font-size:24px;font-weight:800;letter-spacing:1px;">Car Gate</h1>
              <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">سوق السيارات #1 في البحرين</p>
            </td>
          </tr>

          <!-- YELLOW DIVIDER -->
          <tr><td style="background:${YELLOW};height:4px;"></td></tr>

          <!-- BODY -->
          <tr>
            <td style="background:${WHITE};padding:40px;border-radius:0 0 16px 16px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="color:${MUTED};font-size:12px;margin:0;">© 2026 Car Gate – البحرين. جميع الحقوق محفوظة.</p>
              <p style="color:${MUTED};font-size:12px;margin:4px 0 0;">
                <a href="mailto:support@cargate.bh" style="color:${PRIMARY};text-decoration:none;">support@cargate.bh</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
function btnStyle(color = PRIMARY) {
    return `display:inline-block;background:${color};color:${WHITE};padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;margin-top:24px;`;
}
function badge(text, color, bg) {
    return `<span style="background:${bg};color:${color};padding:4px 14px;border-radius:20px;font-weight:700;font-size:13px;">${text}</span>`;
}
let MailService = class MailService {
    configService;
    transporter = null;
    constructor(configService) {
        this.configService = configService;
        const host = this.configService.get('MAIL_HOST');
        const port = this.configService.get('MAIL_PORT') || 587;
        const user = this.configService.get('MAIL_USER');
        const pass = this.configService.get('MAIL_PASS');
        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
            });
            console.log('📧 Mail service: SMTP configured →', host);
        }
        else {
            console.log('📧 Mail service: No SMTP configured — emails will be logged only');
        }
    }
    async sendRegistrationConfirmation(to, userName) {
        const body = `
          <h2 style="color:${PRIMARY};margin:0 0 8px;">مرحباً بك في Car Gate! 👋</h2>
          <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">نشكرك على التسجيل</p>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">عزيزي <strong>${userName || 'المستخدم'}</strong>،</p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            تم استلام طلب تسجيلك بنجاح. حسابك الآن
            ${badge('قيد المراجعة', PRIMARY, '#EEF4FF')}
          </p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            سيتم مراجعة حسابك من قِبَل فريقنا وستصلك رسالة تأكيد خلال <strong>24-48 ساعة</strong> في أيام العمل.
          </p>

          <div style="background:${BG};border-radius:12px;padding:20px;margin:24px 0;border-right:4px solid ${YELLOW};">
            <p style="margin:0;color:${TEXT};font-size:14px;">
              📧 البريد الإلكتروني المسجل: <strong>${to}</strong>
            </p>
          </div>

          <center><a href="${APP_URL}" style="${btnStyle()}">زيارة Car Gate</a></center>
        `;
        await this.sendEmail(to, 'تم استلام طلب التسجيل – Car Gate', emailWrapper(body));
    }
    async sendApprovalEmail(to, userName) {
        const body = `
          <h2 style="color:${PRIMARY};margin:0 0 8px;">🎉 تم قبول حسابك!</h2>
          <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">مبروك — أنت الآن عضو في Car Gate</p>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">عزيزي <strong>${userName || 'المستخدم'}</strong>،</p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            يسعدنا إخبارك بأن حسابك قد تم ${badge('قبوله', '#15803d', '#dcfce7')} من قِبَل فريق Car Gate.
          </p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            يمكنك الآن تسجيل الدخول والاستمتاع بجميع مميزات المنصة: نشر الإعلانات، إدارة معرضك، والمزيد.
          </p>

          <center><a href="${APP_URL}/auth/login" style="${btnStyle()}">تسجيل الدخول الآن</a></center>
        `;
        await this.sendEmail(to, 'تم قبول حسابك – Car Gate ✅', emailWrapper(body));
    }
    async sendRejectionEmail(to, userName, reason) {
        const body = `
          <h2 style="color:${PRIMARY};margin:0 0 8px;">تحديث حول طلبك</h2>
          <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">بخصوص طلب إنشاء الحساب</p>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">عزيزي <strong>${userName || 'المستخدم'}</strong>،</p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            نأسف لإبلاغك بأن طلب إنشاء حسابك قد تم ${badge('رفضه', '#dc2626', '#fee2e2')}.
          </p>

          ${reason ? `
          <div style="background:#FFF8F0;border-radius:12px;padding:20px;margin:20px 0;border-right:4px solid #F97316;">
            <p style="margin:0;color:${TEXT};font-size:14px;font-weight:600;">سبب الرفض:</p>
            <p style="margin:8px 0 0;color:${TEXT};font-size:15px;">${reason}</p>
          </div>` : ''}

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            إذا كنت تعتقد أن هذا القرار خاطئ أو تحتاج مزيداً من التوضيح، يرجى التواصل معنا على:
          </p>
          <p style="text-align:center;margin-top:8px;">
            <a href="mailto:support@cargate.bh" style="color:${PRIMARY};font-weight:700;font-size:15px;">support@cargate.bh</a>
          </p>
        `;
        await this.sendEmail(to, 'تحديث حول طلب حسابك – Car Gate', emailWrapper(body));
    }
    async sendOtpEmail(to, otp) {
        const body = `
          <h2 style="color:${PRIMARY};margin:0 0 8px;">إعادة تعيين كلمة المرور 🔐</h2>
          <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">استخدم الرمز أدناه للمتابعة</p>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. استخدم هذا الرمز:
          </p>

          <div style="background:${BG};border-radius:16px;padding:28px;text-align:center;margin:24px 0;border:2px dashed ${PRIMARY};">
            <p style="margin:0 0 8px;color:${MUTED};font-size:13px;">رمز التحقق (OTP)</p>
            <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:${PRIMARY};font-family:monospace;">${otp}</span>
          </div>

          <p style="color:${MUTED};font-size:13px;text-align:center;">⏱ صالح لمدة <strong>10 دقائق</strong> فقط</p>
          <p style="color:${MUTED};font-size:13px;text-align:center;">إذا لم تطلب هذا الرمز، تجاهل هذه الرسالة.</p>
        `;
        await this.sendEmail(to, 'رمز التحقق لإعادة تعيين كلمة المرور – Car Gate', emailWrapper(body));
    }
    async sendListingApprovedEmail(to, userName, listingTitle, listingId) {
        const body = `
          <h2 style="color:${PRIMARY};margin:0 0 8px;">✅ تم قبول إعلانك!</h2>
          <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">إعلانك الآن مرئي للجميع</p>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">عزيزي <strong>${userName || 'المستخدم'}</strong>،</p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            يسعدنا إخبارك بأن إعلانك قد تم ${badge('قبوله ونشره', '#15803d', '#dcfce7')} على منصة Car Gate.
          </p>

          <div style="background:${BG};border-radius:12px;padding:20px;margin:24px 0;border-right:4px solid ${YELLOW};">
            <p style="margin:0;color:${MUTED};font-size:13px;">الإعلان</p>
            <p style="margin:6px 0 0;color:${TEXT};font-size:16px;font-weight:700;">${listingTitle}</p>
          </div>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            يمكن للمشترين الآن رؤية إعلانك والتواصل معك مباشرةً.
          </p>

          <center>
            <a href="${APP_URL}/cars/${listingId}" style="${btnStyle()}">عرض إعلانك</a>
          </center>
        `;
        await this.sendEmail(to, `تم نشر إعلانك: ${listingTitle} – Car Gate ✅`, emailWrapper(body));
    }
    async sendListingRejectedEmail(to, userName, listingTitle, reason) {
        const body = `
          <h2 style="color:${PRIMARY};margin:0 0 8px;">تحديث حول إعلانك</h2>
          <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">بخصوص إعلانك على Car Gate</p>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">عزيزي <strong>${userName || 'المستخدم'}</strong>،</p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            نأسف لإبلاغك بأن إعلانك قد تم ${badge('رفضه', '#dc2626', '#fee2e2')}.
          </p>

          <div style="background:${BG};border-radius:12px;padding:20px;margin:20px 0;border-right:4px solid #e2e8f0;">
            <p style="margin:0;color:${MUTED};font-size:13px;">الإعلان</p>
            <p style="margin:6px 0 0;color:${TEXT};font-size:16px;font-weight:700;">${listingTitle}</p>
          </div>

          ${reason ? `
          <div style="background:#FFF8F0;border-radius:12px;padding:20px;margin:20px 0;border-right:4px solid #F97316;">
            <p style="margin:0;color:${TEXT};font-size:14px;font-weight:600;">سبب الرفض:</p>
            <p style="margin:8px 0 0;color:${TEXT};font-size:15px;">${reason}</p>
          </div>` : ''}

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            يمكنك تعديل الإعلان وإعادة نشره أو التواصل معنا إذا كان لديك استفسار.
          </p>

          <center>
            <a href="${APP_URL}/my-listings" style="${btnStyle()}">إدارة إعلاناتي</a>
          </center>
        `;
        await this.sendEmail(to, `تحديث حول إعلانك: ${listingTitle} – Car Gate`, emailWrapper(body));
    }
    async sendSubscriptionPendingEmail(to, userName, packageName) {
        const body = `
          <h2 style="color:${PRIMARY};margin:0 0 8px;">تم استلام طلب الاشتراك 📦</h2>
          <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">طلبك قيد المراجعة</p>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">عزيزي <strong>${userName || 'المستخدم'}</strong>،</p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            تم استلام طلب اشتراكك في باقة <strong>${packageName}</strong> وهو الآن ${badge('قيد المراجعة', PRIMARY, '#EEF4FF')}.
          </p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            سيتم تفعيل اشتراكك بعد مراجعة طلبك من قِبَل فريقنا. ستصلك رسالة تأكيد عند تفعيله.
          </p>

          <center><a href="${APP_URL}/packages" style="${btnStyle()}">عرض الباقات</a></center>
        `;
        await this.sendEmail(to, `تم استلام طلب الاشتراك في باقة ${packageName} – Car Gate`, emailWrapper(body));
    }
    async sendSubscriptionActivatedEmail(to, userName, packageName, endDate) {
        const formattedEnd = endDate.toLocaleDateString('ar-BH', { year: 'numeric', month: 'long', day: 'numeric' });
        const body = `
          <h2 style="color:${PRIMARY};margin:0 0 8px;">🎉 تم تفعيل اشتراكك!</h2>
          <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">اشتراكك نشط الآن</p>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">عزيزي <strong>${userName || 'المستخدم'}</strong>،</p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            تم ${badge('تفعيل اشتراكك', '#15803d', '#dcfce7')} في باقة <strong>${packageName}</strong> بنجاح.
          </p>

          <div style="background:${BG};border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
            <p style="margin:0;color:${MUTED};font-size:13px;">الباقة النشطة</p>
            <p style="margin:8px 0;color:${PRIMARY};font-size:22px;font-weight:800;">${packageName}</p>
            <p style="margin:0;color:${MUTED};font-size:13px;">تنتهي في:</p>
            <p style="margin:4px 0 0;color:${TEXT};font-size:16px;font-weight:700;">${formattedEnd}</p>
          </div>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            يمكنك الآن الاستفادة من جميع مميزات الباقة. ابدأ بنشر إعلاناتك!
          </p>

          <center><a href="${APP_URL}/create-listing" style="${btnStyle(YELLOW)}"><span style="color:${PRIMARY};">نشر إعلان جديد ✨</span></a></center>
        `;
        await this.sendEmail(to, `تم تفعيل اشتراكك في ${packageName} – Car Gate 🎉`, emailWrapper(body));
    }
    async sendSubscriptionCancelledEmail(to, userName, packageName) {
        const body = `
          <h2 style="color:${PRIMARY};margin:0 0 8px;">تم إلغاء اشتراكك</h2>
          <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">بخصوص اشتراكك في Car Gate</p>

          <p style="color:${TEXT};font-size:15px;line-height:1.7;">عزيزي <strong>${userName || 'المستخدم'}</strong>،</p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            تم ${badge('إلغاء اشتراكك', '#dc2626', '#fee2e2')} في باقة <strong>${packageName}</strong>.
          </p>
          <p style="color:${TEXT};font-size:15px;line-height:1.7;">
            يمكنك الاشتراك في أي وقت للاستمرار في الاستفادة من مميزات المنصة.
          </p>

          <center><a href="${APP_URL}/packages" style="${btnStyle()}">استعرض الباقات</a></center>
        `;
        await this.sendEmail(to, `تم إلغاء اشتراكك في ${packageName} – Car Gate`, emailWrapper(body));
    }
    async sendEmail(to, subject, html) {
        const from = this.configService.get('MAIL_FROM') || 'noreply@cargate.bh';
        if (this.transporter) {
            try {
                await this.transporter.sendMail({ from, to, subject, html });
                console.log(`📧 Email sent → ${to} | ${subject}`);
            }
            catch (error) {
                console.error(`❌ Email failed → ${to}:`, error);
            }
        }
        else {
            console.log('──────────────────────────────────────');
            console.log(`📧 EMAIL (Dev — not sent)`);
            console.log(`To: ${to}  |  Subject: ${subject}`);
            console.log('──────────────────────────────────────');
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map