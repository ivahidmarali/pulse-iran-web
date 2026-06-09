import Link from "next/link";
import { SITE_URL } from "@/lib/utils";

export type EditorialArticle = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
  body: React.ReactNode;
};

export const ARTICLES: EditorialArticle[] = [
  // ─── Article 1 ────────────────────────────────────────────────────────────
  {
    slug: "taafovot-resane-osoulgarayan",
    title: "تفاوت رسانه‌های اصولگرا و اصلاح‌طلب در ایران",
    description:
      "بررسی تفاوت‌های اساسی در رویکرد تحریریه‌ای، انتخاب رویداد، و قاب‌بندی خبر میان رسانه‌های اصولگرا و اصلاح‌طلب — راهنمایی برای خواندن هوشمندانه‌تر اخبار ایران",
    datePublished: "2026-06-01T12:00:00Z",
    dateModified: "2026-06-01T12:00:00Z",
    keywords: [
      "رسانه اصولگرا",
      "رسانه اصلاح‌طلب",
      "تحلیل رسانه",
      "جریان خبری ایران",
      "گرایش سیاسی",
      "قاب‌بندی خبر",
    ],
    body: (
      <div className="space-y-5">
        <p>
          وقتی یک رویداد مهم در ایران رخ می‌دهد — نتیجه یک انتخابات، تصمیم
          اقتصادی دولت، یا یک حادثه اجتماعی — خواندن صرفاً یک منبع خبری کافی
          نیست. رسانه‌های مختلف، با توجه به گرایش سیاسی‌شان، همان رویداد را به
          شکل‌های متفاوتی روایت می‌کنند. پالس ایران منابع خود را در ۱۱ دسته
          طبقه‌بندی می‌کند؛ دو دسته پررنگ در این طیف{" "}
          <strong className="text-on-surface">اصولگرایان</strong> و{" "}
          <strong className="text-on-surface">اصلاح‌طلبان</strong> هستند. درک
          تفاوت این دو جریان، کلید خواندن آگاهانه‌تر اخبار ایران است.
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          رسانه‌های اصولگرا چه می‌گویند؟
        </h2>
        <p>
          رسانه‌های{" "}
          <Link
            href="/lean/osoulgarayan"
            className="text-secondary-fixed-dim hover:underline"
          >
            اصولگرا
          </Link>{" "}
          عموماً نزدیک به جناح راست سیاسی ایران هستند و بر ارزش‌های انقلاب
          اسلامی، مقاومت در برابر فشار خارجی، و حفظ ساختارهای موجود تأکید
          می‌کنند. ویژگی‌های مشترک این رسانه‌ها:
        </p>
        <ul className="list-disc pr-6 space-y-1.5">
          <li>سیاست‌های دولت را اغلب از زاویه «تهدیدات خارجی» توجیه می‌کنند</li>
          <li>روابط با آمریکا و اسرائیل را از منظر تقابل بازنمایی می‌کنند</li>
          <li>موفقیت‌های نظامی، موشکی، و دیپلماتیک منطقه‌ای را پررنگ می‌کنند</li>
          <li>اعتراضات داخلی را اغلب به دخالت خارجی نسبت می‌دهند</li>
          <li>دستاوردهای اقتصادی را در برابر تحریم‌ها برجسته می‌کنند</li>
        </ul>
        <p className="text-xs text-on-surface-variant/60">
          نمونه‌هایی از این دسته: فارس نیوز، تسنیم، مشرق نیوز، رجانیوز
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          رسانه‌های اصلاح‌طلب چه می‌گویند؟
        </h2>
        <p>
          رسانه‌های{" "}
          <Link
            href="/lean/eslah-talab"
            className="text-secondary-fixed-dim hover:underline"
          >
            اصلاح‌طلب
          </Link>{" "}
          تمایل به نقد ساختارهای قدرت از درون نظام دارند. این رسانه‌ها بیشتر
          به حقوق مدنی، تعامل با غرب، و آزادی‌های اجتماعی توجه می‌کنند:
        </p>
        <ul className="list-disc pr-6 space-y-1.5">
          <li>مطالبات اجتماعی و اقتصادی مردم را برجسته‌تر می‌کنند</li>
          <li>دیپلماسی و مذاکره با جهان را به عنوان راه‌حل اصلی می‌بینند</li>
          <li>نقد سیاست‌های اقتصادی دولت را با صراحت بیشتری مطرح می‌کنند</li>
          <li>صدای منتقدان درون‌نظامی را بیشتر منتقل می‌کنند</li>
          <li>نتایج انتخابات را از زاویه مشارکت مردمی و رقابت واقعی تحلیل می‌کنند</li>
        </ul>
        <p className="text-xs text-on-surface-variant/60">
          نمونه‌هایی از این دسته: اعتماد آنلاین، آرمان ملی، شرق
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          یک خبر، دو روایت
        </h2>
        <p>
          برای درک عملی این تفاوت، فرض کنید دولت تصمیم می‌گیرد قیمت بنزین را
          افزایش دهد:
        </p>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-3 text-on-surface font-semibold">
                  جنبه
                </th>
                <th className="text-right py-3 px-3 text-secondary-fixed-dim font-semibold">
                  رسانه اصولگرا
                </th>
                <th className="text-right py-3 px-3 text-[#a2e7ff] font-semibold">
                  رسانه اصلاح‌طلب
                </th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              <tr className="border-b border-white/5">
                <td className="py-2.5 px-3 text-on-surface/60 text-xs">تیتر</td>
                <td className="py-2.5 px-3">«گام مثبت دولت برای کنترل قاچاق سوخت»</td>
                <td className="py-2.5 px-3">«فشار جدید بر معیشت خانوارهای کم‌درآمد»</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2.5 px-3 text-on-surface/60 text-xs">منابع نقل‌قول</td>
                <td className="py-2.5 px-3">مقامات دولتی و کارشناسان موافق</td>
                <td className="py-2.5 px-3">اقتصاددانان منتقد و نهادهای مدنی</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2.5 px-3 text-on-surface/60 text-xs">چارچوب تحلیل</td>
                <td className="py-2.5 px-3">مصلحت اقتصاد کلان و مبارزه با رانت</td>
                <td className="py-2.5 px-3">تبعات اجتماعی برای اقشار آسیب‌پذیر</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-on-surface/60 text-xs">واکنش پیش‌بینی‌شده</td>
                <td className="py-2.5 px-3">تأکید بر آرامش و انتظار تطابق عمومی</td>
                <td className="py-2.5 px-3">هشدار درباره نارضایتی اجتماعی</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          هیچ‌کدام لزوماً دروغ نمی‌گویند
        </h2>
        <p>
          نکته مهم اینجاست: هیچ‌کدام از این رسانه‌ها لزوماً «دروغ» نمی‌گویند —
          آن‌ها حقیقت را از زاویه دید خود روایت می‌کنند. هر دو ممکن است
          اطلاعات دقیق داشته باشند، اما در <em>انتخاب</em> اینکه کدام اطلاعات
          را برجسته کنند تفاوت اساسی دارند.
        </p>
        <p>
          این پدیده را در علم رسانه «قاب‌بندی» (Framing) می‌نامند. خبرنگار
          انتخاب می‌کند با چه کلماتی، با نقل‌قول از چه کسی، و با تأکید بر
          کدام جنبه، خبر را روایت کند. این انتخاب‌ها بی‌طرفانه نیستند — آن‌ها
          محصول جهان‌بینی و سیاست تحریریه‌ای هر رسانه هستند.
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          چطور هوشمندانه‌تر بخوانیم؟
        </h2>
        <p>
          پالس ایران این تفاوت‌ها را شفاف می‌کند: در کنار هر خبر، گرایش سیاسی
          منبع مشخص است و اخبار از طیف‌های مختلف کنار هم می‌آیند. چند راهکار
          عملی:
        </p>
        <ul className="list-disc pr-6 space-y-2">
          <li>
            <strong className="text-on-surface">برای رویدادهای مهم:</strong> هر
            دو جناح را بخوانید. جایی که روایت‌ها همپوشانی دارند، احتمالاً به
            واقعیت نزدیک‌تر است.
          </li>
          <li>
            <strong className="text-on-surface">به «سکوت» توجه کنید:</strong>{" "}
            هر رسانه چه چیزی را <em>نمی‌گوید</em>؟ اغلب حذف‌ها آموزنده‌تر از
            آن چیزی هستند که گفته می‌شود.
          </li>
          <li>
            <strong className="text-on-surface">
              منبع نقل‌قول‌ها را بررسی کنید:
            </strong>{" "}
            «کارشناس مستقل» چه سابقه‌ای دارد؟ آیا همیشه در یک جهت اظهارنظر
            می‌کند؟
          </li>
          <li>
            <strong className="text-on-surface">
              اعداد را جدا دنبال کنید:
            </strong>{" "}
            آمارهای اقتصادی و اجتماعی از منابع رسمی مثل مرکز آمار ایران را
            مستقیم بخوانید و با روایت رسانه‌ها مقایسه کنید.
          </li>
        </ul>

        <p>
          در صفحه هر منبع در پالس ایران، گرایش سیاسی آن را می‌بینید. این
          برچسب‌ها قضاوت درباره کیفیت یا صداقت آن رسانه نیستند — ابزاری برای
          خواندن آگاهانه‌تر هستند. هدف ما کمک به شما برای ساختن تصویری
          کامل‌تر از واقعیت است، نه اینکه به جای شما تصمیم بگیریم کدام رسانه
          «خوب» است.
        </p>
      </div>
    ),
  },

  // ─── Article 2 ────────────────────────────────────────────────────────────
  {
    slug: "jame-jahani-2026",
    title: "جام جهانی ۲۰۲۶: راهنمای کامل تیم ملی ایران",
    description:
      "راهنمای جامع حضور ایران در جام جهانی ۲۰۲۶ آمریکا، کانادا و مکزیک — برنامه بازی‌ها، بازیکنان کلیدی، فرمت ۴۸ تیمی، و تاریخچه تیم ملی در جام جهانی",
    datePublished: "2026-06-09T10:00:00Z",
    dateModified: "2026-06-09T10:00:00Z",
    keywords: [
      "جام جهانی ۲۰۲۶",
      "تیم ملی ایران جام جهانی",
      "برنامه بازی‌های ایران",
      "Iran World Cup 2026",
      "ایران جام جهانی آمریکا",
      "نتایج جام جهانی",
    ],
    body: (
      <div className="space-y-5">
        <p>
          جام جهانی فیفا ۲۰۲۶ از ۱۱ ژوئن تا ۱۹ ژوئیه (۲۱ خرداد تا ۲۸ تیر
          ۱۴۰۵) در سه کشور آمریکا، کانادا و مکزیک برگزار می‌شود. این دوره از
          جام جهانی تاریخی است — برای اولین بار ۴۸ تیم ملی در بزرگ‌ترین
          رویداد ورزشی جهان شرکت می‌کنند. ایران با صعود از مرحله انتخابی آسیا
          (AFC)، حضور خود را در این رقابت‌ها تضمین کرده است.
        </p>

        <p>
          برای دنبال کردن نتایج زنده بازی‌های ایران و سایر مسابقات جام جهانی،
          صفحه{" "}
          <Link
            href="/livescore"
            className="text-secondary-fixed-dim hover:underline font-semibold"
          >
            نتایج زنده پالس ایران
          </Link>{" "}
          را به‌روزرسانی خودکار هر ۳۰ ثانیه دنبال کنید.
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          فرمت جدید ۴۸ تیمی — چه تغییری کرده است؟
        </h2>
        <p>
          جام جهانی ۲۰۲۶ اولین دوره‌ای است که با ۴۸ تیم برگزار می‌شود — افزایش
          چشمگیری نسبت به ۳۲ تیم دوره‌های قبلی. ساختار جدید به این شکل است:
        </p>
        <ul className="list-disc pr-6 space-y-1.5">
          <li>
            <strong className="text-on-surface">مرحله گروهی:</strong> ۱۲ گروه
            ۴ تیمی — دو تیم اول هر گروه صعود می‌کنند، به علاوه ۸ تیم برتر
            سوم
          </li>
          <li>
            <strong className="text-on-surface">مرحله حذفی:</strong> از مرحله
            یک‌هشتم نهایی (۳۲ تیم) شروع می‌شود
          </li>
          <li>
            <strong className="text-on-surface">فینال:</strong> ۱۹ ژوئیه ۲۰۲۶
            در استادیوم متلایف، نیوجرسی (آمریکا)
          </li>
        </ul>
        <p>
          این فرمت فرصت بیشتری برای تیم‌های آسیایی از جمله ایران ایجاد
          می‌کند — سهمیه آسیا از ۴.۵ به ۸ تیم افزایش یافته است.
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          مسیر ایران به جام جهانی ۲۰۲۶
        </h2>
        <p>
          ایران از طریق مرحله نهایی انتخابی آسیا (AFC Asian Qualifiers —
          Round 3) صعود کرد. تیم ملی در این مرحله یکی از پنج تیم برتر آسیا
          بود که به‌طور مستقیم سهمیه جام جهانی گرفتند.
        </p>
        <p>
          جام جهانی ۲۰۲۶ هفتمین حضور ایران در این مسابقات است. ایران از سال
          ۱۹۷۸ (جام جهانی آرژانتین) در دوره‌های ۱۹۷۸، ۱۹۹۸، ۲۰۰۶، ۲۰۱۴،
          ۲۰۱۸، ۲۰۲۲ و حالا ۲۰۲۶ حضور داشته است.
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          بازیکنان کلیدی تیم ملی ایران
        </h2>
        <p>
          تیم ملی ایران در سال‌های اخیر با بازیکنان حرفه‌ای فعال در لیگ‌های
          اروپایی بهبود چشمگیری داشته است. بازیکنانی که نظرها را به خود جلب
          می‌کنند:
        </p>
        <ul className="list-disc pr-6 space-y-2">
          <li>
            <strong className="text-on-surface">مهدی طارمی</strong> — مهاجم —
            یکی از تأثیرگذارترین بازیکنان آسیایی در اروپا، تجربه گلزنی در
            لیگ‌های بزرگ قاره سبز
          </li>
          <li>
            <strong className="text-on-surface">سردار آزمون</strong> — مهاجم
            — گلزن پرسابقه تیم ملی، حضور طولانی در لیگ‌های روسیه و اروپا
          </li>
          <li>
            <strong className="text-on-surface">علیرضا جهانبخش</strong> — هافبک
            — بازیکن خلاق و پرتجربه با سال‌ها حضور در لیگ برتر هلند و بلژیک
          </li>
          <li>
            <strong className="text-on-surface">احسان حاج‌صفی</strong> — کاپیتان
            — نماد تجربه و رهبری در دفاع تیم ملی
          </li>
          <li>
            <strong className="text-on-surface">میلاد محمدی</strong> — مدافع چپ
            — یکی از بهترین مدافعان کناری آسیا با حضور در لیگ‌های اروپایی
          </li>
        </ul>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          برنامه بازی‌ها و نتایج زنده
        </h2>
        <p>
          برای مشاهده جدول کامل برنامه بازی‌های ایران در مرحله گروهی، نتایج
          زنده، و آمار دقیق هر بازی، صفحه نتایج زنده پالس ایران را دنبال
          کنید:
        </p>
        <div className="rounded-2xl bg-surface-container p-5 flex flex-col gap-3 border border-secondary-fixed-dim/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse" />
            <span className="text-sm font-bold text-secondary-fixed-dim">
              نتایج زنده — به‌روزرسانی هر ۳۰ ثانیه
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">
            نتایج و برنامه بازی‌های جام جهانی ۲۰۲۶ از جمله بازی‌های تیم ملی
            ایران
          </p>
          <Link
            href="/livescore"
            className="self-start px-5 py-2 bg-secondary-fixed-dim text-[#101415] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
          >
            نتایج زنده ←
          </Link>
        </div>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          تاریخچه ایران در جام جهانی
        </h2>
        <p>
          ایران یکی از قدیمی‌ترین تیم‌های آسیایی حاضر در جام جهانی است. مرور
          مختصری از حضورهای پیشین:
        </p>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-2 px-3 text-on-surface font-semibold">دوره</th>
                <th className="text-right py-2 px-3 text-on-surface font-semibold">کشور میزبان</th>
                <th className="text-right py-2 px-3 text-on-surface font-semibold">نتیجه</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              <tr className="border-b border-white/5">
                <td className="py-2 px-3">۱۹۷۸</td>
                <td className="py-2 px-3">آرژانتین</td>
                <td className="py-2 px-3">مرحله گروهی</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3">۱۹۹۸</td>
                <td className="py-2 px-3">فرانسه</td>
                <td className="py-2 px-3">مرحله گروهی — برد تاریخی ۲–۱ مقابل آمریکا</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3">۲۰۰۶</td>
                <td className="py-2 px-3">آلمان</td>
                <td className="py-2 px-3">مرحله گروهی</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3">۲۰۱۴</td>
                <td className="py-2 px-3">برزیل</td>
                <td className="py-2 px-3">مرحله گروهی — تعادل ۰–۰ با آرژانتین</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3">۲۰۱۸</td>
                <td className="py-2 px-3">روسیه</td>
                <td className="py-2 px-3">مرحله گروهی — برد ۱–۰ مقابل مراکش</td>
              </tr>
              <tr>
                <td className="py-2 px-3">۲۰۲۲</td>
                <td className="py-2 px-3">قطر</td>
                <td className="py-2 px-3">مرحله گروهی — برد ۲–۰ مقابل ولز</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          چشم‌انداز ایران در جام جهانی ۲۰۲۶
        </h2>
        <p>
          با فرمت گسترش‌یافته ۴۸ تیمی، شانس ایران برای عبور از مرحله گروهی
          بیشتر از دوره‌های قبلی است. تیم ملی در سال‌های اخیر با حضور
          بازیکنان حرفه‌ای در اروپا، بازی منسجم‌تری ارائه داده است.
        </p>
        <p>
          چالش اصلی ایران معمولاً در مقابل تیم‌های اروپایی و آمریکای لاتین
          بوده است. اما با تجربه‌ای که بازیکنان کلیدی مانند طارمی، آزمون و
          جهانبخش در لیگ‌های اروپایی کسب کرده‌اند، این تیم ظرفیت شگفتی‌آفرینی
          دارد.
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          سوالات متداول
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm mb-1">
              جام جهانی ۲۰۲۶ کجا برگزار می‌شود؟
            </p>
            <p className="text-sm text-on-surface-variant">
              در سه کشور آمریکا (میزبان اصلی)، کانادا و مکزیک. مسابقه فینال در
              استادیوم متلایف در نیوجرسی آمریکا برگزار می‌شود.
            </p>
          </div>
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm mb-1">
              چند تیم در جام جهانی ۲۰۲۶ شرکت می‌کنند؟
            </p>
            <p className="text-sm text-on-surface-variant">
              برای اولین بار ۴۸ تیم ملی در این رقابت‌ها شرکت دارند — افزایش از
              ۳۲ تیم دوره‌های قبلی. سهمیه آسیا (AFC) هم از ۴.۵ به ۸ تیم
              رسیده است.
            </p>
          </div>
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm mb-1">
              ایران چند بار در جام جهانی شرکت کرده است؟
            </p>
            <p className="text-sm text-on-surface-variant">
              جام جهانی ۲۰۲۶ هفتمین حضور ایران است. قبلاً در سال‌های ۱۹۷۸،
              ۱۹۹۸، ۲۰۰۶، ۲۰۱۴، ۲۰۱۸ و ۲۰۲۲ هم حضور داشته‌ایم.
            </p>
          </div>
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm mb-1">
              کجا می‌توان نتایج بازی‌های ایران را زنده دنبال کرد؟
            </p>
            <p className="text-sm text-on-surface-variant">
              صفحه{" "}
              <Link
                href="/livescore"
                className="text-secondary-fixed-dim hover:underline"
              >
                نتایج زنده پالس ایران
              </Link>{" "}
              هر ۳۰ ثانیه به‌روز می‌شود و تمام بازی‌های جام جهانی را پوشش
              می‌دهد.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  // ─── Article 3 ────────────────────────────────────────────────────────────
  {
    slug: "behtarin-manba-khabari",
    title: "بهترین منبع خبری فارسی برای ایرانیان خارج از کشور",
    description:
      "راهنمای جامع انتخاب بهترین منابع خبری فارسی — مقایسه رسانه‌های داخلی و خارج از ایران، نکات خواندن انتقادی، و چرا خواندن چند منبع با گرایش‌های مختلف اهمیت دارد",
    datePublished: "2026-06-09T12:00:00Z",
    dateModified: "2026-06-09T12:00:00Z",
    keywords: [
      "منبع خبری فارسی",
      "اخبار ایران خارج از کشور",
      "سایت خبری فارسی",
      "اخبار فارسی آنلاین",
      "رسانه فارسی",
      "بهترین خبرگزاری ایران",
    ],
    body: (
      <div className="space-y-5">
        <p>
          برای ایرانیان مقیم خارج از کشور، دنبال کردن اخبار ایران یک چالش
          واقعی است. از یک طرف، رسانه‌های داخلی گاهی با محدودیت‌های
          دسترسی یا سوگیری‌های جدی روبه‌رو هستند. از طرف دیگر، رسانه‌های
          خارج از ایران هم لزوماً بی‌طرف نیستند — هر کدام زاویه دید خاص
          خودشان را دارند. چطور بین این همه صدا، معتبرترین اطلاعات را پیدا
          کنیم؟
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          دو دسته اصلی رسانه فارسی
        </h2>
        <p>
          رسانه‌های فارسی را می‌توان به دو دسته بزرگ تقسیم کرد:
        </p>
        <ul className="list-disc pr-6 space-y-2">
          <li>
            <strong className="text-on-surface">رسانه‌های مستقر در ایران:</strong>{" "}
            خبرگزاری‌ها و روزنامه‌هایی که زیر نظر دولت، نهادهای نظامی، یا
            احزاب سیاسی فعالیت می‌کنند. دسترسی به منابع خبری داخلی بالاتر
            است، اما سوگیری سیاسی هم بیشتر.
          </li>
          <li>
            <strong className="text-on-surface">رسانه‌های خارج از ایران:</strong>{" "}
            شبکه‌های ماهواره‌ای، رادیوها و وبسایت‌هایی که از آمریکا، بریتانیا
            یا اروپا فعالیت می‌کنند. آزادی عمل بیشتری دارند، اما گاهی با
            تمویل‌کنندگان یا اهداف سیاسی خاصی مرتبطند.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          رسانه‌های پرمخاطب مستقر خارج از ایران
        </h2>

        <div className="space-y-3">
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm">BBC فارسی</p>
            <p className="text-sm text-on-surface-variant mt-1">
              یکی از معتبرترین و شناخته‌شده‌ترین رسانه‌های فارسی. تحت نظر
              BBC World Service بریتانیا فعالیت می‌کند. پوشش گسترده اخبار،
              گزارش‌های تحقیقاتی، و برنامه‌های تحلیلی. استانداردهای روزنامه‌نگاری
              نسبتاً بالایی دارد.
            </p>
          </div>
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm">ایران اینترنشنال</p>
            <p className="text-sm text-on-surface-variant mt-1">
              شبکه تلویزیونی مستقر در لندن با پوشش ۲۴ ساعته اخبار ایران.
              گرایش آشکاری به پوشش اخبار منتقدانه از حکومت ایران دارد.
              منابع خوبی از داخل ایران دارد اما باید با آگاهی از این زاویه
              دید خوانده شود.
            </p>
          </div>
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm">رادیو فردا</p>
            <p className="text-sm text-on-surface-variant mt-1">
              بخش فارسی Radio Free Europe/Radio Liberty، با تأمین مالی از
              کنگره آمریکا. رپورتاژهای جامع و پوشش رویدادهای داخل ایران،
              به‌خصوص حقوق بشر و جامعه مدنی.
            </p>
          </div>
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm">VOA فارسی</p>
            <p className="text-sm text-on-surface-variant mt-1">
              صدای آمریکا — رسانه دولتی آمریکا با بخش فارسی فعال. پوشش
              وسیع اخبار ایران و آمریکا. ساختار دولتی آن را در زمینه روابط
              ایران و آمریکا باید در نظر داشت.
            </p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          رسانه‌های اصلی مستقر در ایران
        </h2>
        <p>
          رسانه‌های داخلی ایران طیف وسیعی از گرایش‌های سیاسی را پوشش
          می‌دهند. پالس ایران منابع را در{" "}
          <Link
            href="/sources"
            className="text-secondary-fixed-dim hover:underline"
          >
            ۱۱ دسته گرایش سیاسی
          </Link>{" "}
          طبقه‌بندی کرده است:
        </p>
        <ul className="list-disc pr-6 space-y-1.5">
          <li>
            <strong className="text-on-surface">خبرگزاری‌های دولتی:</strong>{" "}
            ایرنا (IRNA)، مهر — پوشش وسیع، نزدیک به دولت
          </li>
          <li>
            <strong className="text-on-surface">رسانه‌های اصولگرا:</strong>{" "}
            فارس، تسنیم، مشرق — گرایش به سمت جناح راست
          </li>
          <li>
            <strong className="text-on-surface">رسانه‌های اصلاح‌طلب:</strong>{" "}
            اعتماد، آرمان، ایلنا — صدای منتقدان میانه‌رو
          </li>
          <li>
            <strong className="text-on-surface">رسانه‌های اقتصادی:</strong>{" "}
            دنیای اقتصاد، ایسنا — تخصصی‌تر در اقتصاد و کسب‌وکار
          </li>
        </ul>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          راهنمای خواندن هوشمندانه
        </h2>
        <p>
          هیچ رسانه واحدی «بهترین منبع» برای همه اخبار نیست. راهکار عملی
          این است که برای رویدادهای مهم، چند منبع با گرایش‌های مختلف را
          بخوانید:
        </p>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-2 px-3 text-on-surface font-semibold">نوع خبر</th>
                <th className="text-right py-2 px-3 text-on-surface font-semibold">پیشنهاد</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              <tr className="border-b border-white/5">
                <td className="py-2.5 px-3 text-sm">سیاست داخلی ایران</td>
                <td className="py-2.5 px-3 text-sm">یک رسانه اصولگرا + یک اصلاح‌طلب + BBC فارسی</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2.5 px-3 text-sm">اقتصاد و بازار</td>
                <td className="py-2.5 px-3 text-sm">دنیای اقتصاد + ایسنا + اعداد مستقیم از بانک مرکزی</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2.5 px-3 text-sm">حقوق بشر</td>
                <td className="py-2.5 px-3 text-sm">رادیو فردا + ایران اینترنشنال + گزارش‌های سازمان‌های بین‌المللی</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-sm">اخبار بین‌الملل مرتبط با ایران</td>
                <td className="py-2.5 px-3 text-sm">BBC فارسی + ایرنا (روایت رسمی) + منابع انگلیسی‌زبان</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          چرا پالس ایران متفاوت است
        </h2>
        <p>
          پالس ایران یک رسانه خبری نیست — یک <em>تجمیع‌کننده</em> است. به
          جای اینکه خودش تولید محتوا کند، اخبار را از بیش از ۴۵ منبع داخلی و
          خارجی جمع‌آوری می‌کند و در کنار هر خبر، گرایش سیاسی منبع را نشان
          می‌دهد.
        </p>
        <p>
          این رویکرد دو مزیت دارد: شما در یک مکان می‌توانید روایت‌های مختلف
          از یک رویداد را ببینید، و می‌دانید هر روایت از کجا می‌آید. کمتر
          فریب یک روایت واحد می‌خورید.
        </p>
        <ul className="list-disc pr-6 space-y-1.5">
          <li>
            <Link
              href="/categories"
              className="text-secondary-fixed-dim hover:underline"
            >
              اخبار دسته‌بندی‌شده
            </Link>{" "}
            بر اساس موضوع
          </li>
          <li>
            <Link
              href="/lean/osoulgarayan"
              className="text-secondary-fixed-dim hover:underline"
            >
              صفحات گرایش سیاسی
            </Link>{" "}
            برای هر جریان خبری
          </li>
          <li>
            <Link
              href="/sources"
              className="text-secondary-fixed-dim hover:underline"
            >
              پروفایل کامل
            </Link>{" "}
            هر منبع خبری
          </li>
        </ul>

        <h2 className="text-lg font-bold text-on-surface pt-2">
          سوالات متداول
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm mb-1">
              آیا BBC فارسی کاملاً بی‌طرف است؟
            </p>
            <p className="text-sm text-on-surface-variant">
              BBC فارسی استانداردهای روزنامه‌نگاری بالایی دارد، اما به‌عنوان
              رسانه‌ای تحت نظر دولت بریتانیا، ممکن است در برخی موضوعات
              سیاست خارجی سوگیری داشته باشد. خواندن آن کنار منابع داخلی
              تصویر کامل‌تری می‌دهد.
            </p>
          </div>
          <div className="rounded-xl bg-surface-container p-4">
            <p className="font-bold text-on-surface text-sm mb-1">
              چطور بفهمیم یک خبر معتبر است؟
            </p>
            <p className="text-sm text-on-surface-variant">
              اگر همان خبر را چند منبع مختلف با گرایش‌های متفاوت تأیید
              کنند، احتمال صحت آن بالاتر است. پالس ایران اخباری را که توسط
              چند منبع تأیید شده، با برچسب «تأیید چندمنبعه» مشخص می‌کند.
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export function getArticle(slug: string): EditorialArticle | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

// Unused import suppression — SITE_URL may be used in article body links
void SITE_URL;
