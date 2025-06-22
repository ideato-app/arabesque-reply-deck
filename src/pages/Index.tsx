
import { useState, useEffect } from 'react';
import { Copy, Plus, MessageCircle, DollarSign, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Response {
  id: string;
  title: string;
  content: string;
  category: string;
}

const CATEGORIES = {
  general: 'الاستفسارات العامة',
  pricing: 'معلومات الأسعار',
  objections: 'الاعتراضات والردود',
  advantages: 'مميزات العمل معي'
};

const CATEGORY_ICONS = {
  general: MessageCircle,
  pricing: DollarSign,
  objections: Shield,
  advantages: Star
};

const DEFAULT_RESPONSES: Response[] = [
  {
    id: '1',
    title: 'ترحيب بالعميل الجديد',
    content: 'أهلاً وسهلاً بك! يسعدني التواصل معك. كيف يمكنني مساعدتك اليوم؟ أنا هنا للإجابة على جميع استفساراتك وتقديم أفضل الخدمات.',
    category: 'general'
  },
  {
    id: '2',
    title: 'الاستفسار عن الخدمات',
    content: 'نقدم مجموعة شاملة من الخدمات المتخصصة التي تلبي احتياجاتك بأعلى معايير الجودة والاحترافية. يمكنني تقديم تفاصيل أكثر حول الخدمة التي تهتم بها.',
    category: 'general'
  },
  {
    id: '3',
    title: 'أسعار الخدمات الأساسية',
    content: 'أسعارنا تنافسية جداً مقارنة بالسوق، ونقدم قيمة استثنائية مقابل السعر. يمكنني إرسال عرض سعر مفصل يناسب احتياجاتك المحددة.',
    category: 'pricing'
  },
  {
    id: '4',
    title: 'التعامل مع الاعتراض على السعر',
    content: 'أتفهم قلقك بشأن التكلفة. دعني أوضح لك القيمة الحقيقية التي ستحصل عليها والنتائج المضمونة التي ستحققها من استثمارك معنا.',
    category: 'objections'
  },
  {
    id: '5',
    title: 'مميزات العمل معي',
    content: 'خبرة عملية واسعة، التزام بالمواعيد، جودة عالية في التنفيذ، متابعة مستمرة، وضمان الرضا التام. نحن نضمن تحقيق أهدافك بأفضل الطرق الممكنة.',
    category: 'advantages'
  }
];

const Index = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [newResponse, setNewResponse] = useState({ title: '', content: '', category: 'general' });
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedResponses = localStorage.getItem('arabicResponses');
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    } else {
      setResponses(DEFAULT_RESPONSES);
      localStorage.setItem('arabicResponses', JSON.stringify(DEFAULT_RESPONSES));
    }
  }, []);

  const saveResponses = (updatedResponses: Response[]) => {
    setResponses(updatedResponses);
    localStorage.setItem('arabicResponses', JSON.stringify(updatedResponses));
  };

  const handleAddResponse = () => {
    if (!newResponse.title.trim() || !newResponse.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const response: Response = {
      id: Date.now().toString(),
      title: newResponse.title,
      content: newResponse.content,
      category: newResponse.category
    };

    const updatedResponses = [...responses, response];
    saveResponses(updatedResponses);
    setNewResponse({ title: '', content: '', category: 'general' });
    setShowForm(false);
    
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم إضافة الرد الجديد بنجاح"
    });
  };

  const handleCopy = (content: string, title: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "تم النسخ",
        description: `تم نسخ "${title}" إلى الحافظة`
      });
    });
  };

  const getResponsesByCategory = (category: string) => {
    return responses.filter(response => response.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            إدارة الردود المسبقة
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            نظم وادر ردودك المسبقة للعملاء بطريقة احترافية وسهلة
          </p>
        </div>

        {/* Add Response Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة رد جديد
          </Button>
        </div>

        {/* Add Response Form */}
        {showForm && (
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-slide-in">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
              <CardTitle className="text-2xl text-gray-900">إضافة رد جديد</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عنوان الرد
                </label>
                <Input
                  placeholder="أدخل عنوان الرد..."
                  value={newResponse.title}
                  onChange={(e) => setNewResponse({ ...newResponse, title: e.target.value })}
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  القسم
                </label>
                <Select
                  value={newResponse.category}
                  onValueChange={(value) => setNewResponse({ ...newResponse, category: value })}
                >
                  <SelectTrigger className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  محتوى الرد
                </label>
                <Textarea
                  placeholder="أدخل محتوى الرد..."
                  value={newResponse.content}
                  onChange={(e) => setNewResponse({ ...newResponse, content: e.target.value })}
                  rows={4}
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddResponse}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  حفظ الرد
                </Button>
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Response Categories */}
        <div className="space-y-12">
          {Object.entries(CATEGORIES).map(([categoryKey, categoryName]) => {
            const categoryResponses = getResponsesByCategory(categoryKey);
            const IconComponent = CATEGORY_ICONS[categoryKey as keyof typeof CATEGORY_ICONS];
            
            if (categoryResponses.length === 0) return null;
            
            return (
              <div key={categoryKey} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
                  <div className="flex-1 h-px bg-gradient-to-l from-indigo-200 to-purple-200"></div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryResponses.map((response, index) => (
                    <Card
                      key={response.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm group animate-slide-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-gray-900 leading-relaxed">
                          {response.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {response.content}
                        </p>
                        <Button
                          onClick={() => handleCopy(response.content, response.title)}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg"
                        >
                          <Copy className="w-4 h-4 ml-2" />
                          نسخ الرد
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            تم تطوير هذا الموقع لتسهيل إدارة الردود المسبقة للعملاء
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
