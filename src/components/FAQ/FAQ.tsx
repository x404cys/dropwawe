'use client';

const faqs = [
  {
    question: 'هل أحتاج كمبيوتر للعمل على دروب ويف؟',
    answer:
      'تم تصميم النظام ليعمل بكفاءة عالية على شاشات الهواتف الذكية، ويمكنك استخدامه بسهولة وسرعة دون أي مشاكل، ومع ذلك فإن العمل على شاشات أكبر يوفر تجربة استخدام أكثر سلاسة ومرونة.',
    open: true,
  },
  {
    question: 'ما هي منتجات دروب ويف؟',
    answer:
      'توفر دروب ويف مجموعة كبيرة من المنتجات لتجار الدروبشيبينغ، ويمكنك الاطلاع على المنتجات بالكامل من خلال زر المخزون داخل المنصة.',
  },
  {
    question: 'أرغب بالاشتراك، لكن لا تتوفر لدي وسيلة دفع حالياً؟',
    answer:
      'يمكنك التواصل مع فريق خدمة العملاء عبر وسائل التواصل المتاحة أسفل الموقع الإلكتروني، وسيقوم الفريق بمساعدتك وتقديم الحلول المناسبة.',
  },
  {
    question: 'كم من الوقت أحتاج حتى أبدأ البيع؟',
    answer:
      'يمكنك البدء خلال فترة قصيرة جداً، حيث توفر لك دروب ويف متجرًا جاهزًا ومنتجات ومحتوى تسويقي معد مسبقًا مما يسرّع عملية الإطلاق.',
  },
  {
    question: 'هل أحتاج إلى خبرة تقنية أو معرفة بالبرمجة؟',
    answer:
      'لا، لا تحتاج إلى أي خبرة تقنية. تم تصميم المنصة بواجهة سهلة وبسيطة تتيح لك إدارة متجرك بكل سلاسة حتى لو كانت تجربتك الأولى.',
  },
];

export default function FAQSection() {
  return (
    <section dir="rtl" className="bg-white px-5 md:px-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          الأسئلة الأكثر شيوعًا
          <span className="block text-base font-normal text-gray-500">حول منصة دروب ويف</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              open={faq.open}
              className="group border-s-4 border-gray-200 bg-gray-50 p-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-2">
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <svg
                  className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>

              <p className="pt-4 leading-relaxed text-gray-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
