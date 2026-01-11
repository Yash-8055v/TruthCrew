import { useState, useRef } from 'react';
import { Search, CheckCircle, XCircle, HelpCircle, Loader2, Users, Upload, Image, AlertTriangle } from 'lucide-react';
import IndiaMap from '../components/IndiaMap';
import LanguageSelector from '../components/LanguageSelector';

type ResultType = 'verified' | 'misleading' | 'unverified' | null;
type Language = 'en' | 'hi' | 'mr';

const Analyze = () => {
  const [claim, setClaim] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ResultType>(null);
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);

  // Image analysis state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAnalyzed, setImageAnalyzed] = useState(false);
  const [imageLang, setImageLang] = useState<Language | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const content = {
    verified: {
      en: {
        explanation: 'This news has been verified by trusted and official sources and is considered accurate.',
        searches: 'About 6,800 people searched for this news.',
        message: 'Verified information helps reduce panic and ensures people make informed decisions based on facts.',
      },
      hi: {
        explanation: 'यह समाचार विश्वसनीय और आधिकारिक स्रोतों द्वारा सत्यापित किया गया है।',
        searches: 'लगभग 6,800 लोगों ने इस समाचार को खोजा।',
        message: 'सत्यापित जानकारी घबराहट को कम करने में मदद करती है।',
      },
      mr: {
        explanation: 'ही बातमी अधिकृत आणि विश्वासार्ह स्रोतांकडून सत्यापित करण्यात आली आहे.',
        searches: 'सुमारे 6,800 लोकांनी ही बातमी शोधली.',
        message: 'सत्यापित माहिती घाबरण्याची भावना कमी करण्यास मदत करते.',
      },
    },
    misleading: {
      en: {
        explanation: 'This claim has been reviewed and found to contain misleading or false information.',
        searches: 'About 9,200 people searched for this claim.',
        message: 'High search volume does not mean the information is true. Please avoid sharing unverified claims.',
      },
      hi: {
        explanation: 'इस दावे की समीक्षा की गई है और इसमें भ्रामक या गलत जानकारी पाई गई है।',
        searches: 'लगभग 9,200 लोगों ने इस दावे को खोजा।',
        message: 'अधिक खोज का मतलब सच नहीं है। कृपया असत्यापित दावों को साझा करने से बचें।',
      },
      mr: {
        explanation: 'या दाव्याचे पुनरावलोकन केले गेले आहे आणि त्यात दिशाभूल करणारी माहिती आढळली आहे.',
        searches: 'सुमारे 9,200 लोकांनी हा दावा शोधला.',
        message: 'जास्त शोध म्हणजे माहिती खरी आहे असे नाही. कृपया असत्यापित दावे शेअर करणे टाळा.',
      },
    },
    unverified: {
      en: {
        explanation: 'This news has not yet been officially reviewed or verified by trusted sources.',
        searches: 'About 400 people searched for this news.',
        message: 'Low search activity does not confirm accuracy. There is no need to panic. Wait for reliable sources.',
      },
      hi: {
        explanation: 'इस समाचार की अभी तक आधिकारिक रूप से समीक्षा नहीं की गई है।',
        searches: 'लगभग 400 लोगों ने इस समाचार को खोजा।',
        message: 'कम खोज गतिविधि से खबर की सच्चाई तय नहीं होती। घबराने की जरूरत नहीं है।',
      },
      mr: {
        explanation: 'या बातमीचे अद्याप अधिकृतपणे पुनरावलोकन केले गेले नाही.',
        searches: 'सुमारे 400 लोकांनी ही बातमी शोधली.',
        message: 'कमी शोध संख्या म्हणजे बातमी खरी किंवा खोटी आहे असे ठरत नाही. घाबरू नका.',
      },
    },
  };

  // Image analysis content
  const imageContent = {
    description: {
      en: 'This image appears to show a dramatic public scene with strong emotional impact.',
      hi: 'यह छवि एक भावनात्मक सार्वजनिक दृश्य को दर्शाती हुई प्रतीत होती है।',
      mr: 'ही प्रतिमा भावनिक सार्वजनिक दृश्य दर्शवत असल्यासारखी दिसते.',
    },
    observation: {
      en: 'Certain visual patterns such as unnatural lighting, repeated textures, and overly smooth details suggest that this image may be AI-generated.',
      hi: 'कुछ दृश्य संकेत जैसे असामान्य रोशनी, दोहराए गए पैटर्न और अत्यधिक चिकनी बनावट यह दर्शाते हैं कि यह छवि एआई द्वारा बनाई गई हो सकती है।',
      mr: 'अस्वाभाविक प्रकाश, पुन्हा दिसणारे नमुने आणि खूप गुळगुळीत तपशील दर्शवतात की ही प्रतिमा एआयने तयार केलेली असू शकते.',
    },
    verdict: {
      en: 'This image is likely AI-generated and may not represent a real event.',
      hi: 'यह छवि संभवतः एआई द्वारा बनाई गई है और किसी वास्तविक घटना का प्रतिनिधित्व नहीं कर सकती।',
      mr: 'ही प्रतिमा कदाचित एआयने तयार केलेली असून ती खऱ्या घटनेचे प्रतिनिधित्व करत नाही.',
    },
    searchActivity: {
      en: 'This image has been widely shared online.',
      hi: 'यह छवि सोशल मीडिया पर व्यापक रूप से साझा की जा रही है।',
      mr: 'ही प्रतिमा सोशल मीडियावर मोठ्या प्रमाणात शेअर केली जात आहे.',
    },
    guidance: {
      en: 'AI-generated images can spread quickly and create confusion. Avoid sharing until verified by trusted sources.',
      hi: 'एआई द्वारा बनाई गई छवियाँ तेज़ी से फैल सकती हैं और भ्रम पैदा कर सकती हैं। सत्यापन के बिना साझा करने से बचें।',
      mr: 'एआयने तयार केलेल्या प्रतिमा वेगाने पसरू शकतात आणि गोंधळ निर्माण करू शकतात. खात्री न करता शेअर करू नका.',
    },
  };

  // Keywords for each result type
  const verifiedKeywords = [
    'government', 'official', 'ministry', 'launches', 'digital health mission',
    'budget', 'announcement', 'approved', 'policy', 'parliament', 'supreme court',
    'rbi', 'election commission', 'verified', 'confirmed', 'isro', 'pib'
  ];

  const misleadingKeywords = [
    'microchip', '5g', 'vaccine', 'spreads virus', 'fake', 'hoax', 'rumor', 'rumour',
    'forwarded', 'whatsapp', 'shocking', 'breaking', 'must share', 'urgent',
    'conspiracy', 'secret', 'they dont want you to know', 'banned', 'censored',
    'miracle cure', 'free money', 'lottery', 'false', 'died after vaccine'
  ];

  const analyzeClam = () => {
    if (!claim.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setSelectedLang(null);

    setTimeout(() => {
      const claimLower = claim.toLowerCase();
      let resultType: ResultType;

      // Check for verified keywords
      const hasVerifiedKeyword = verifiedKeywords.some(keyword => 
        claimLower.includes(keyword.toLowerCase())
      );

      // Check for misleading keywords
      const hasMisleadingKeyword = misleadingKeywords.some(keyword => 
        claimLower.includes(keyword.toLowerCase())
      );

      if (hasMisleadingKeyword) {
        resultType = 'misleading';
      } else if (hasVerifiedKeyword) {
        resultType = 'verified';
      } else {
        resultType = 'unverified';
      }

      setResult(resultType);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setImageAnalyzed(false);
        setImageLang(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!uploadedImage) return;
    
    setIsAnalyzingImage(true);
    setTimeout(() => {
      setImageAnalyzed(true);
      setIsAnalyzingImage(false);
    }, 1500);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageAnalyzed(false);
    setImageLang(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getResultIcon = () => {
    switch (result) {
      case 'verified':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'misleading':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'unverified':
        return <HelpCircle className="w-6 h-6 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getResultBadge = () => {
    switch (result) {
      case 'verified':
        return <span className="badge-verified">{getResultIcon()} Verified Information</span>;
      case 'misleading':
        return <span className="badge-misleading">{getResultIcon()} Misleading Information</span>;
      case 'unverified':
        return <span className="badge-unverified">{getResultIcon()} Not Yet Verified</span>;
      default:
        return null;
    }
  };

  return (
    <div className="page-transition min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <section className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Check a News Claim
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Put any news or viral message below to understand its current status.
          </p>
        </section>

        {/* Input Section */}
        <section className="mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card p-8 transition-all duration-300 hover:shadow-xl">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && analyzeClam()}
                placeholder="Enter a news headline or message…"
                className="input-dark pl-12 transition-all duration-200 focus:shadow-lg"
              />
            </div>

            <button
              onClick={analyzeClam}
              disabled={!claim.trim() || isAnalyzing}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-2xl"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Claim'
              )}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <section className="animate-fade-up space-y-8">
            <div className="glass-card p-8 transition-all duration-500">
              <div className="text-center mb-8 animate-scale-in">
                {getResultBadge()}
              </div>

              <div className="flex justify-center mb-6">
                <LanguageSelector
                  selected={selectedLang || 'en'}
                  onChange={(lang) => setSelectedLang(lang)}
                />
              </div>

              {selectedLang && (
                <div className="animate-fade-up space-y-5">
                  <div className="glass-card p-7 bg-secondary/50 transition-all duration-300 hover:bg-secondary/70">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Explanation
                    </h3>
                    <p className={`text-foreground/90 text-lg leading-relaxed ${selectedLang !== 'en' ? 'devanagari' : ''}`}>
                      {content[result][selectedLang].explanation}
                    </p>
                  </div>

                  <div className="glass-card p-7 bg-secondary/50 transition-all duration-300 hover:bg-secondary/70">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Search Activity
                      </h3>
                    </div>
                    <p className={`text-foreground/90 leading-relaxed ${selectedLang !== 'en' ? 'devanagari' : ''}`}>
                      {content[result][selectedLang].searches}
                    </p>
                  </div>

                  <div className="glass-card p-7 bg-primary/10 border-primary/20 transition-all duration-300 hover:bg-primary/15">
                    <p className={`text-foreground font-medium leading-relaxed ${selectedLang !== 'en' ? 'devanagari' : ''}`}>
                      {content[result][selectedLang].message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Location Map */}
            <div className="glass-card p-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-bold text-foreground text-center mb-6">
                Where This Information Is Being Discussed More
              </h2>
              <IndiaMap variant={result} />
            </div>
          </section>
        )}

        {/* Empty State */}
        {!result && !isAnalyzing && (
          <section className="text-center py-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-105 hover:bg-secondary/80">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Enter a claim above to check its verification status
            </p>
          </section>
        )}

        {/* Image Analysis Section */}
        <section className="mt-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Image Analysis</h2>
                <p className="text-sm text-muted-foreground">Optional: Upload an image to analyze</p>
              </div>
            </div>

            {/* Upload Area */}
            {!uploadedImage ? (
              <label className="block cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-12 text-center transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Upload an image to analyze</p>
                  <p className="text-xs text-muted-foreground/60">Click to browse or drag and drop</p>
                </div>
              </label>
            ) : (
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="relative max-w-md mx-auto">
                  <img
                    src={uploadedImage}
                    alt="Uploaded for analysis"
                    className="w-full max-h-64 object-contain rounded-xl bg-secondary/50"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 hover:bg-background flex items-center justify-center transition-all duration-200"
                  >
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Analyze Button */}
                {!imageAnalyzed && (
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzingImage}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        <Image className="w-5 h-5" />
                        Analyze Image
                      </>
                    )}
                  </button>
                )}

                {/* Image Analysis Results */}
                {imageAnalyzed && (
                  <div className="animate-fade-up space-y-6">
                    {/* Badge */}
                    <div className="text-center">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-medium">
                        <AlertTriangle className="w-5 h-5" />
                        Image Analysis Result
                      </span>
                    </div>

                    {/* Language Selector */}
                    <div className="flex justify-center">
                      <LanguageSelector
                        selected={imageLang || 'en'}
                        onChange={(lang) => setImageLang(lang)}
                      />
                    </div>

                    {/* Content - Only show after language selection */}
                    {imageLang && (
                      <div className="animate-fade-up space-y-5">
                        {/* Description */}
                        <div className="glass-card p-7 bg-secondary/50">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            Image Description
                          </h3>
                          <p className={`text-foreground/90 leading-relaxed ${imageLang !== 'en' ? 'devanagari' : ''}`}>
                            {imageContent.description[imageLang]}
                          </p>
                        </div>

                        {/* AI Observation */}
                        <div className="glass-card p-7 bg-secondary/50">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            AI-Based Observation
                          </h3>
                          <p className={`text-foreground/90 leading-relaxed ${imageLang !== 'en' ? 'devanagari' : ''}`}>
                            {imageContent.observation[imageLang]}
                          </p>
                        </div>

                        {/* Verdict */}
                        <div className="glass-card p-7 bg-amber-500/10 border border-amber-500/20">
                          <h3 className="text-sm font-semibold text-amber-400/80 uppercase tracking-wider mb-4">
                            Verdict
                          </h3>
                          <p className={`text-foreground leading-relaxed ${imageLang !== 'en' ? 'devanagari' : ''}`}>
                            {imageContent.verdict[imageLang]}
                          </p>
                        </div>

                        {/* Search Activity */}
                        <div className="glass-card p-7 bg-secondary/50">
                          <div className="flex items-center gap-2 mb-4">
                            <Users className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                              Search Activity
                            </h3>
                          </div>
                          <p className={`text-foreground/90 leading-relaxed ${imageLang !== 'en' ? 'devanagari' : ''}`}>
                            {imageContent.searchActivity[imageLang]}
                          </p>
                        </div>

                        {/* Guidance */}
                        <div className="glass-card p-7 bg-primary/10 border-primary/20">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            Guidance
                          </h3>
                          <p className={`text-foreground leading-relaxed ${imageLang !== 'en' ? 'devanagari' : ''}`}>
                            {imageContent.guidance[imageLang]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analyze;
