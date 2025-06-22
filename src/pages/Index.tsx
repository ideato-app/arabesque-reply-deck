import { useState, useEffect } from 'react';
import { Copy, Plus, MessageCircle, DollarSign, Shield, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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

const Index = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [newResponse, setNewResponse] = useState({ title: '', content: '', category: 'general' });
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchResponses = async () => {
    try {
      const response = await fetch('/responses.json');
      if (response.ok) {
        const data = await response.json();
        setResponses(data);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الردود",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveResponsesToFile = async (updatedResponses: Response[]) => {
    try {
      // Note: In a real application, you would need a backend API to save the file
      // For now, we'll update the state and show a warning
      setResponses(updatedResponses);
      
      toast({
        title: "تنبيه",
        description: "تم حفظ التغييرات محلياً. لحفظ دائم، تحتاج إلى خادم خلفي.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error saving responses:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ الردود",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

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
    saveResponsesToFile(updatedResponses);
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

  const handleDeleteResponse = (responseId: string, responseTitle: string) => {
    const updatedResponses = responses.filter(response => response.id !== responseId);
    saveResponsesToFile(updatedResponses);
    
    toast({
      title: "تم الحذف بنجاح",
      description: `تم حذف "${responseTitle}" بنجاح`
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" />
          <p className="text-xl text-slate-300">جاري تحميل الردود...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-6 green-glow">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
            إدارة الردود المسبقة
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            نظم وادر ردودك المسبقة للعملاء بطريقة احترافية وسهلة
          </p>
        </div>

        {/* Add Response Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 green-glow"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة رد جديد
          </Button>
        </div>

        {/* Add Response Form */}
        {showForm && (
          <Card className="mb-8 border-slate-600 shadow-xl bg-slate-800/90 backdrop-blur-sm animate-slide-in">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg border-b border-slate-600">
              <CardTitle className="text-2xl text-green-400">إضافة رد جديد</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  عنوان الرد
                </label>
                <Input
                  placeholder="أدخل عنوان الرد..."
                  value={newResponse.title}
                  onChange={(e) => setNewResponse({ ...newResponse, title: e.target.value })}
                  className="border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-green-500 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  القسم
                </label>
                <Select
                  value={newResponse.category}
                  onValueChange={(value) => setNewResponse({ ...newResponse, category: value })}
                >
                  <SelectTrigger className="border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Object.entries(CATEGORIES).map(([key, value]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-slate-600">
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  محتوى الرد
                </label>
                <Textarea
                  placeholder="أدخل محتوى الرد..."
                  value={newResponse.content}
                  onChange={(e) => setNewResponse({ ...newResponse, content: e.target.value })}
                  rows={4}
                  className="border-slate-600 bg-slate-700 text-white focus:border-green-500 focus:ring-green-500 resize-none placeholder:text-slate-400"
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
                  className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Response Categories */}
        {responses.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">لا توجد ردود محفوظة</h3>
            <p className="text-slate-500">ابدأ بإضافة ردك الأول باستخدام الزر أعلاه</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(CATEGORIES).map(([categoryKey, categoryName]) => {
              const categoryResponses = getResponsesByCategory(categoryKey);
              const IconComponent = CATEGORY_ICONS[categoryKey as keyof typeof CATEGORY_ICONS];
              
              if (categoryResponses.length === 0) return null;
              
              return (
                <div key={categoryKey} className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl green-glow">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-400">{categoryName}</h2>
                    <div className="flex-1 h-px bg-gradient-to-l from-green-500 to-slate-700"></div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categoryResponses.map((response, index) => (
                      <Card
                        key={response.id}
                        className="border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-slate-800/90 backdrop-blur-sm group animate-slide-in card-shadow hover:card-shadow-hover"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg font-semibold text-green-400 leading-relaxed flex-1">
                              {response.title}
                            </CardTitle>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-slate-800 border-slate-600">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">تأكيد الحذف</AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-300">
                                    هل أنت متأكد من أنك تريد حذف "{response.title}"؟ لن يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                                    إلغاء
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteResponse(response.id, response.title)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-slate-300 leading-relaxed text-sm">
                            {response.content}
                          </p>
                          <Button
                            onClick={() => handleCopy(response.content, response.title)}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg"
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
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-700">
          <p className="text-slate-400">
            تم تطوير هذا الموقع لتسهيل إدارة الردود المسبقة للعملاء
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
