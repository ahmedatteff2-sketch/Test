package handlers

import (
	"html"
	"sync"

	"github.com/gofiber/fiber/v2"
)

var (
	contentMutex    sync.RWMutex
	allowedSections = map[string]bool{
		"hero":            true,
		"stats":           true,
		"about":           true,
		"features":        true,
		"how_it_works":    true,
		"transformations": true,
		"testimonials":    true,
		"pricing":         true,
		"faq":             true,
		"cta":             true,
	}
)

func sanitizeContent(val interface{}) interface{} {
	switch v := val.(type) {
	case string:
		return html.EscapeString(v)
	case map[string]interface{}:
		sanitized := make(map[string]interface{})
		for k, valItem := range v {
			sanitized[k] = sanitizeContent(valItem)
		}
		return sanitized
	case []interface{}:
		sanitized := make([]interface{}, len(v))
		for i, valItem := range v {
			sanitized[i] = sanitizeContent(valItem)
		}
		return sanitized
	default:
		return v
	}
}

// ContentHandler handles CMS content endpoints.
type ContentHandler struct{}

// NewContentHandler creates a new ContentHandler.
func NewContentHandler() *ContentHandler {
	return &ContentHandler{}
}

// Demo site content - in production this comes from the site_content table
var siteContent = map[string]interface{}{
	"hero": map[string]interface{}{
		"headline":    "ابني جسمك\nاكسر حدودك",
		"subheadline": "أقوى منصة تدريب أونلاين في مصر. جداول تمرين مخصصة، نظام غذائي محسوب بالجرامات، ومتابعة يومية تضمن لك الوصول لهدفك في أسرع وقت.",
		"ctaText":    "ابدأ رحلتك الآن",
		"metric1Value": "+2,400",
		"metric1Label": "مشترك",
		"metric2Value": "98%",
		"metric2Label": "نسبة الالتزام",
		"metric3Value": "4.9★",
		"metric3Label": "تقييم المشتركين",
	},
	"stats": map[string]interface{}{
		"items": []map[string]interface{}{
			{"value": 2400, "suffix": "+", "label": "عميل سعيد"},
			{"value": 98, "suffix": "%", "label": "نسبة الرضا"},
			{"value": 15, "suffix": "+", "label": "سنة خبرة"},
			{"value": 50, "suffix": "K+", "label": "تمرين مسجل"},
		},
	},
	"about": map[string]interface{}{
		"title":      "مين هو الكوتش؟",
		"paragraph1": "خبرة أكتر من 10 سنين في مجال الفيتنس والتغذية. ساعدت مئات الأشخاص إنهم يغيروا شكل جسمهم وحياتهم بالكامل من خلال خطط علمية مبنية على أحدث الأبحاث.",
		"paragraph2": "مبدأنا هنا مش بس \"دايت قاسي\" أو \"تمرين يهلكك\"، مبدأنا هو الاستمرارية. هعلمك إزاي تفهم جسمك، تاكل اللي بتحبه ضمن احتياجك، وتتطور في أوزانك بأمان.",
		"stat1Value": "10+", "stat1Label": "سنين خبرة",
		"stat2Value": "500+", "stat2Label": "تحول ناجح",
		"stat3Value": "99%", "stat3Label": "نسبة الرضا",
		"stat4Value": "24/7", "stat4Label": "دعم ومتابعة",
	},
	"features": map[string]interface{}{
		"visible": true,
		"items": []map[string]interface{}{
			{
				"number":      "01",
				"title":       "خطط تدريب مخصصة",
				"description": "برامج تدريبية مصممة خصيصاً لمستوى لياقتك البدنية وأهدافك، سواء كنت مبتدئاً أو متقدماً.",
			},
			{
				"number":      "02",
				"title":       "نظام غذائي مرن",
				"description": "حساب السعرات والماكروز بما يتناسب مع أكلاتك المفضلة وسهل الالتزام به.",
			},
			{
				"number":      "03",
				"title":       "متابعة يومية مستمرة",
				"description": "متابعة تطور الأوزان والقياسات والرد على استفساراتك بشكل مستمر لتضمن الوصول لهدفك.",
			},
			{
				"number":      "04",
				"title":       "تقييم أداء التمارين",
				"description": "تعديل طريقة أدائك للتمارين عبر مراجعة الفيديوهات لضمان السلامة والفعالية.",
			},
			{
				"number":      "05",
				"title":       "دعم مجتمعي وحافز",
				"description": "تواصل مع مجتمع المشتركين لتبادل الخبرات والتحفيز المستمر.",
			},
			{
				"number":      "06",
				"title":       "تحديثات دورية للمستويات",
				"description": "تعديل مستمر للخطط والبرامج بناءً على تطور جسمك واستجابتك للمستويات.",
			},
		},
	},
	"how_it_works": map[string]interface{}{
		"title":       "إزاي بنوصلك لهدفك؟",
		"description": "خطوات بسيطة وواضحة، هنكون معاك خطوة بخطوة.",
		"items": []map[string]interface{}{
			{"num": "01", "title": "الاستبيان الأولي", "desc": "هتملا فورم تفصيلي عن حالتك، هدفك، تاريخك المرضي، والأكل اللي بتحبه.", "icon": "📋"},
			{"num": "02", "title": "تصميم الخطة", "desc": "الكوتش هيصمم لك جدول تمرين ونظام غذائي مخصصين 100% لجسمك وهدفك.", "icon": "🎯"},
			{"num": "03", "title": "بدأ الرحلة", "desc": "هتدخل على المنصة بتاعتنا، هتلاقي كل حاجة واضحة وبالفيديوهات والشرح.", "icon": "🚀"},
			{"num": "04", "title": "المتابعة والتطور", "desc": "تشيكن يومي أو أسبوعي حسب باقتك، وتعديلات مستمرة عشان نضمن النتيجة.", "icon": "📈"},
		},
	},
	"transformations": map[string]interface{}{
		"title":               "النتيجة هي اللي بتتكلم",
		"description":         "متخيل إنك مش هتقدر؟ دي صور لبعض أبطالنا اللي كانوا مكانك في يوم من الأيام وقرروا يغيروا حياتهم.",
		"featuredName":        "رحلة بطل",
		"featuredTitle":       "من 120 كيلو لـ 85 كيلو عضل صافي",
		"featuredDescription": "الموضوع مكنش بس تغيير في شكلي، ده تغيير في ثقتي بنفسي وحياتي كلها. المتابعة فرقت معايا في كل تفصيلة.",
	},
	"testimonials": map[string]interface{}{
		"title":       "قصص نجاح تصنع الفارق",
		"description": "آراء بعض المشتركين في رحلتهم لتغيير شكل أجسامهم وحياتهم مع نظام التدريب والمتابعة المتكامل.",
		"items": []map[string]interface{}{
			{
				"id":     1,
				"name":   "أحمد عبد الله",
				"result": "خسرت 22 كجم في 4 شهور",
				"text":   "التجربة مع الكوتش غيرت حياتي تماماً. نظام الدايت مرن وسهل الالتزام بيه، والتمرين كان متفصل على حجم وقتي ومستوايا الصعب في الشغل.",
				"rating": 5,
				"avatar": "أ",
			},
			{
				"id":     2,
				"name":   "سارة محمود",
				"result": "بناء عضل وتقليل دهون (Recomp)",
				"text":   "مكنتش متخيلة إن البنت تقدر تبني عضل من غير ما تضخم بشكل مش حلو. المتابعة وتعديل التمارين والوجبات خلاني أوصل لجسم أحلامي وصحتي بقت أحسن بكتير.",
				"rating": 5,
				"avatar": "س",
			},
			{
				"id":     3,
				"name":   "مصطفى كريم",
				"result": "زيادة 12 كجم كتلة عضلية",
				"text":   "أفضل استثمار عملته في صحتي وجسمي. المتابعة اليومية والاهتمام بالتفاصيل وحل مشاكل إصابة الكتف اللي كانت عندي خلاني أتمرن بأوزان أثقل وأنا مطمن.",
				"rating": 5,
				"avatar": "م",
			},
			{
				"id":     4,
				"name":   "حسام الجيار",
				"result": "تنشيف وظهور العضلات في 12 أسبوع",
				"text":   "الكوتش بيتابع كل تفصيلة حتى جودة النوم والضغط والمياه. المتابعة الأسبوعية بالصور والوزن وتحديث الجدول خلتني دايماً ملتزم وفي قمة الحماس.",
				"rating": 5,
				"avatar": "ح",
			},
		},
	},
	"pricing": map[string]interface{}{
		"title":       "استثمر في صحتك",
		"description": "اختار الباقة اللي تناسب هدفك وميزانيتك.",
		"items": []map[string]interface{}{
			{
				"name":        "الباقة الأساسية",
				"price":       "1500",
				"period":      "شهرياً",
				"description": "مثالية للمبتدئين اللي محتاجين توجيه.",
				"features": []string{
					"جدول تمرين مخصص",
					"نظام غذائي محسوب",
					"تشيكن أسبوعي",
					"تعديل النظام مرة شهرياً",
				},
				"highlighted": false,
			},
			{
				"name":        "باقة النخبة (VIP)",
				"price":       "3500",
				"period":      "شهرياً",
				"description": "للي عايز أفضل نتيجة في أسرع وقت مع متابعة لصيقة.",
				"features": []string{
					"كل مميزات الباقة الأساسية",
					"تشيكن يومي (24/7 دعم)",
					"تحليل فيديوهات التمرين",
					"تعديلات لا نهائية على النظام",
					"مكملات غذائية مخصصة",
				},
				"highlighted": true,
			},
			{
				"name":        "باقة الـ 3 شهور",
				"price":       "4000",
				"period":      "3 شهور",
				"description": "التزام طويل المدى بسعر أوفر.",
				"features": []string{
					"نفس مميزات الباقة الأساسية",
					"خصم 15%",
					"تتبع التطور على المدى الطويل",
					"مكالمة زوم شهرية مع الكوتش",
				},
				"highlighted": false,
			},
		},
	},
	"faq": map[string]interface{}{
		"title":       "الأسئلة الشائعة",
		"description": "كل ما يدور في ذهنك عن البرنامج ونظام التدريب والمتابعة اليومية وإجاباتها بالتفصيل.",
		"items": []map[string]interface{}{
			{
				"question": "هل نظام التغذية بيعتمد على الحرمان؟",
				"answer":   "لا طبعاً! نظام التغذية مرن وبيعتمد على حساب السعرات والماكروز (البروتين، الكارب، الدهون). بنوفرلك وجبات لذيذة وصحية من اختيارك، وتقدر تاكل أكل البيت العادي أو الأكل اللي بتحبه طالما في حدود سعراتك اليومية وهدفك.",
			},
			{
				"question": "هل أحتاج مكملات غذائية عشان أعمل نتيجة؟",
				"answer":   "المكملات هي 'عامل مكمل' للدايت وليست أساسية. الأساس هو الأكل الطبيعي المتوازن. إذا كنت محتاج مكملات معينة بناءً على فحص أو نقص معين، الكوتش هيرشحلك المناسب، لكن تقدر تعمل نتيجة خرافية 100% بدون أي مكملات.",
			},
			{
				"question": "أنا مبتدئ تماماً، هل البرنامج مناسب ليا؟",
				"answer":   "البرنامج مثالي للمبتدئين. بنصمم الخطة التدريبية خطوة بخطوة، وبنوفرلك شرح فيديو لكل تمرين عشان تعرف التكنيك الصحيح وتتفادى الإصابات. الكوتش كمان بيراجع فيديوهات تمرينك اللي بتبعتها عشان يصححلك الأداء أول بأول.",
			},
			{
				"question": "كيف بتتم المتابعة اليومية مع الكوتش؟",
				"answer":   "المتابعة بتتم يومياً من خلال شات المنصة، وبشكل تفصيلي من خلال 'التشيكن' اليومي اللي بتسجل فيه التزامك بالدايت والتمرين والمياه والنوم. أسبوعياً بيتم مراجعة الوزن والقياسات وصور التطور وبناءً عليها بنعدل الجداول لو محتاجة تغيير.",
			},
			{
				"question": "هل ينفع أتمرن في البيت لو مش متاح جيم؟",
				"answer":   "طبعاً! بنفصلك برنامج تمارين منزلية حسب الأدوات المتاحة عندك (سواء بوزن الجسم، أو أستيك المقاومة، أو دمبلز خفيفة) وبنضمنلك تحقق أقصى استفادة وجسم مثالي.",
			},
			{
				"question": "إيه اللي بيحصل لو وزني ثبت أو بطلت أحقق نتايج؟",
				"answer":   "هنا بييجي دور المتابعة الذكية؛ الكوتش بيحلل بياناتك الأسبوعية واليومية وبيحدد سبب الثبات (سواء قلة نوم، احتباس سوائل، أو تكيف الأيض)، وبنعدل السعرات أو التمارين فوراً لكسر الثبات والاستمرار في التطور.",
			},
		},
	},
	"cta": map[string]interface{}{
		"badgeText":     "أماكن متاحة الآن",
		"title":         "جاهز تبدأ رحلة التحول؟",
		"description":   "الخطوة الأولى هي الأصعب — بعدها كل حاجة بتبقى أسهل. سجّل دلوقتي واحصل على استشارة مجانية.",
		"ctaText":       "سجّل الآن — مجاناً",
		"secondaryText": "تواصل معنا",
		"features": []string{
			"✓ بدون التزام",
			"✓ استشارة مجانية",
			"✓ خطة مخصصة",
		},
	},
}

// GetSection returns CMS content for a specific section.
func (h *ContentHandler) GetSection(c *fiber.Ctx) error {
	section := c.Params("section")
	
	// Validate whitelist
	if !allowedSections[section] {
		return fiber.NewError(fiber.StatusBadRequest, "invalid section key")
	}

	contentMutex.RLock()
	content, exists := siteContent[section]
	contentMutex.RUnlock()

	if !exists {
		return fiber.NewError(fiber.StatusNotFound, "section not found")
	}
	return OK(c, content)
}

// UpdateSection updates CMS content for a section (admin only).
func (h *ContentHandler) UpdateSection(c *fiber.Ctx) error {
	section := c.Params("section")

	// Validate whitelist
	if !allowedSections[section] {
		return fiber.NewError(fiber.StatusBadRequest, "invalid section key")
	}

	// Limit body size to 100KB to prevent memory exhaustion / DOS
	if len(c.Body()) > 100*1024 {
		return fiber.NewError(fiber.StatusRequestEntityTooLarge, "request body exceeds 100KB limit")
	}

	var body map[string]interface{}
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	// Sanitize content input recursively to prevent XSS
	sanitizedBody := sanitizeContent(body).(map[string]interface{})

	contentMutex.Lock()
	siteContent[section] = sanitizedBody
	contentMutex.Unlock()

	return OK(c, map[string]string{"message": "content updated"})
}
