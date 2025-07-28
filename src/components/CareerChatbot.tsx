import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  GraduationCap, 
  Briefcase, 
  BookOpen,
  Star,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  confidence?: number;
}

interface Intent {
  name: string;
  keywords: string[];
  responses: string[];
  icon: React.ComponentType<any>;
}

const CareerChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Comprehensive intent recognition system
  const intents: Intent[] = [
    {
      name: 'greeting',
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
      responses: [
        "Hi there! 👋 I'm your career guidance assistant. How can I help you today?",
        "Good morning! 🌅 Ready to explore your career path? What would you like to know?",
        "Hello! 😊 I'm here to help you with career guidance, internships, and academic advice. What's on your mind?",
        "Hey! 🎯 Let's work together to shape your future. What career topics interest you?"
      ],
      icon: GraduationCap
    },
    {
      name: 'internships',
      keywords: ['internship', 'intern', 'summer job', 'work experience', 'placement', 'training'],
      responses: [
        "Great question about internships! 🚀 Here are some tips:\n\n• Start applying 3-6 months early\n• Tailor your resume for each application\n• Look at company websites, LinkedIn, and job boards\n• Consider both paid and unpaid opportunities for experience\n• Prepare for technical and behavioral interviews\n\nWhat specific field are you interested in?",
        "Internships are crucial for career development! 💼 Consider these popular platforms:\n\n• LinkedIn Jobs\n• Indeed Internships\n• Glassdoor\n• Company career pages\n• University career centers\n• AngelList (for startups)\n\nWhich industry catches your eye?",
        "Here's how to land a great internship:\n\n1. Build relevant skills through online courses\n2. Create projects to showcase your abilities\n3. Network with professionals in your field\n4. Follow up on applications professionally\n5. Practice interview skills regularly\n\nNeed help with any specific step?"
      ],
      icon: Briefcase
    },
    {
      name: 'resume',
      keywords: ['resume', 'cv', 'curriculum vitae', 'portfolio', 'profile', 'application'],
      responses: [
        "Let's build an impressive resume! 📄 Here's the structure:\n\n• Contact Information\n• Professional Summary (2-3 lines)\n• Education (GPA if >3.5)\n• Relevant Experience\n• Technical Skills\n• Projects\n• Certifications\n• Achievements\n\nKeep it to 1-2 pages max. Want help with any specific section?",
        "Resume building tips that work! ✨\n\n• Use action verbs (developed, implemented, achieved)\n• Quantify your accomplishments with numbers\n• Customize for each job application\n• Use a clean, professional format\n• Include relevant keywords from job descriptions\n• Proofread multiple times\n\nWhich section would you like to improve?",
        "Essential resume elements for students:\n\n1. Clear formatting and readable fonts\n2. Relevant coursework and academic projects\n3. Leadership experience and volunteer work\n4. Technical skills and programming languages\n5. Soft skills demonstrated through examples\n\nNeed help crafting any particular section?"
      ],
      icon: BookOpen
    },
    {
      name: 'college_admissions',
      keywords: ['college', 'university', 'admission', 'application', 'entrance', 'gpa', 'sat', 'act', 'essay'],
      responses: [
        "College admissions strategy! 🎓 Key components:\n\n• Strong GPA (aim for 3.5+)\n• Standardized test scores (SAT/ACT)\n• Compelling personal essays\n• Letters of recommendation\n• Extracurricular activities\n• Community service\n• Leadership roles\n\nWhich area would you like to focus on improving?",
        "Here's your college application roadmap:\n\n1. Research schools that match your goals\n2. Prepare for standardized tests early\n3. Build relationships with teachers for recommendations\n4. Start essays months in advance\n5. Apply for financial aid (FAFSA)\n6. Consider safety, match, and reach schools\n\nNeed guidance on any specific step?",
        "College admission tips from successful students:\n\n• Show genuine passion in your essays\n• Demonstrate growth and learning from challenges\n• Highlight unique experiences and perspectives\n• Apply to a balanced list of schools\n• Meet all deadlines well in advance\n• Visit campuses if possible\n\nWhat's your biggest concern about applications?"
      ],
      icon: GraduationCap
    },
    {
      name: 'career_options',
      keywords: ['career', 'job', 'profession', 'field', 'industry', 'opportunity', 'path', 'future'],
      responses: [
        "Exciting career exploration! 🌟 Popular fields include:\n\n• Technology (Software, Data Science, AI/ML)\n• Healthcare (Medicine, Nursing, Therapy)\n• Business (Marketing, Finance, Consulting)\n• Engineering (Civil, Mechanical, Electrical)\n• Creative (Design, Writing, Media)\n• Education (Teaching, Training, Research)\n\nWhat interests you most? I can provide specific guidance!",
        "Let's discover your ideal career path! 🎯 Consider:\n\n1. Your natural strengths and interests\n2. Market demand and job growth\n3. Salary expectations and lifestyle\n4. Required education and skills\n5. Work environment preferences\n6. Growth opportunities\n\nWhich factor is most important to you?",
        "Emerging career opportunities to consider:\n\n• Cybersecurity Specialist\n• UX/UI Designer\n• Data Analyst\n• Sustainability Consultant\n• Digital Marketing Manager\n• Cloud Solutions Architect\n• Mental Health Counselor\n\nWant to learn more about any of these?"
      ],
      icon: Star
    },
    {
      name: 'project_ideas',
      keywords: ['project', 'portfolio', 'coding', 'programming', 'development', 'build', 'create'],
      responses: [
        "Awesome project ideas to build your portfolio! 💻\n\n**Beginner:**\n• Personal website/blog\n• To-do list app\n• Weather dashboard\n• Calculator with history\n\n**Intermediate:**\n• E-commerce mockup\n• Task management system\n• Data visualization tool\n• Mobile app prototype\n\n**Advanced:**\n• Machine learning project\n• Full-stack web application\n• API development\n• Open source contribution\n\nWhich level matches your current skills?",
        "Portfolio project suggestions by field:\n\n**Web Development:**\n• Social media dashboard\n• Restaurant booking system\n• Online learning platform\n\n**Data Science:**\n• Predictive analytics model\n• Data visualization story\n• A/B testing analysis\n\n**Mobile Development:**\n• Fitness tracking app\n• Expense manager\n• Local business finder\n\nWhat field interests you most?",
        "Project ideas that impress employers:\n\n1. Solve a real-world problem\n2. Use modern technologies and frameworks\n3. Include comprehensive documentation\n4. Deploy your project live\n5. Add testing and error handling\n6. Show continuous improvement\n\nNeed help planning your next project?"
      ],
      icon: BookOpen
    },
    {
      name: 'extracurricular',
      keywords: ['extracurricular', 'activities', 'clubs', 'volunteer', 'leadership', 'sports', 'community'],
      responses: [
        "Extracurricular activities that boost your profile! 🌟\n\n**Leadership:**\n• Student government\n• Club president/officer\n• Team captain\n• Event organizer\n\n**Community Service:**\n• Local nonprofits\n• Tutoring programs\n• Environmental projects\n• Senior center volunteering\n\n**Skills Development:**\n• Coding clubs\n• Debate team\n• Language clubs\n• Academic competitions\n\nWhat type of activity interests you most?",
        "Benefits of extracurricular involvement:\n\n• Develops leadership and teamwork skills\n• Shows commitment and time management\n• Builds network and friendships\n• Enhances college applications\n• Provides real-world experience\n• Helps discover passions and interests\n\nWhich benefit appeals to you most?",
        "How to maximize extracurricular impact:\n\n1. Choose activities you're genuinely passionate about\n2. Aim for leadership positions over time\n3. Show measurable impact and achievements\n4. Balance quantity with quality involvement\n5. Document your experiences for applications\n6. Connect activities to career goals\n\nNeed help choosing the right activities?"
      ],
      icon: Star
    },
    {
      name: 'academics',
      keywords: ['study', 'grades', 'gpa', 'exam', 'test', 'academic', 'course', 'subject', 'learning'],
      responses: [
        "Academic excellence strategies! 📚\n\n**Study Techniques:**\n• Active recall and spaced repetition\n• Pomodoro Technique (25-min focused sessions)\n• Mind mapping for complex topics\n• Teaching concepts to others\n\n**Time Management:**\n• Use planners and calendars\n• Break large tasks into smaller ones\n• Set specific study goals\n• Eliminate distractions\n\nWhich area would you like to improve?",
        "Boosting your GPA effectively:\n\n1. Attend all classes and participate actively\n2. Form study groups with motivated peers\n3. Visit professors during office hours\n4. Start assignments early, avoid cramming\n5. Seek help from tutoring centers\n6. Focus extra effort on challenging subjects\n\nWhat's your biggest academic challenge?",
        "Essential academic skills for success:\n\n• Critical thinking and analysis\n• Effective writing and communication\n• Research and information literacy\n• Problem-solving methodologies\n• Collaboration and teamwork\n• Adaptability and continuous learning\n\nWhich skill would you like to develop further?"
      ],
      icon: BookOpen
    },
    {
      name: 'job_opportunities',
      keywords: ['job search', 'employment', 'hiring', 'work', 'position', 'opening', 'recruitment'],
      responses: [
        "Job search strategies that work! 💼\n\n**Where to Look:**\n• LinkedIn Jobs\n• Company career pages\n• Indeed, Glassdoor\n• Industry-specific job boards\n• Career fairs and networking events\n• Professional associations\n\n**Application Tips:**\n• Customize each application\n• Follow up professionally\n• Prepare for various interview formats\n• Research company culture\n\nWhat industry are you targeting?",
        "Making yourself stand out to employers:\n\n1. Develop in-demand skills continuously\n2. Build a strong professional network\n3. Create an impressive online presence\n4. Gain relevant experience through internships\n5. Obtain industry certifications\n6. Practice interviewing regularly\n\nWhich area needs your attention first?",
        "Current job market trends to consider:\n\n• Remote work opportunities increasing\n• Tech skills in high demand across industries\n• Soft skills becoming more valued\n• Continuous learning is essential\n• Personal branding matters more than ever\n• Networking remains crucial for opportunities\n\nWant specific advice for your field?"
      ],
      icon: Briefcase
    }
  ];

  // Simple NLP processing for intent recognition
  const processMessage = (message: string): { intent: string; confidence: number } => {
    const lowercaseMessage = message.toLowerCase();
    let bestMatch = { intent: 'unknown', confidence: 0 };

    for (const intent of intents) {
      let matchCount = 0;
      for (const keyword of intent.keywords) {
        if (lowercaseMessage.includes(keyword)) {
          matchCount++;
        }
      }
      
      const confidence = matchCount / intent.keywords.length;
      if (confidence > bestMatch.confidence) {
        bestMatch = { intent: intent.name, confidence };
      }
    }

    return bestMatch;
  };

  const generateResponse = (intent: string): string => {
    const intentObj = intents.find(i => i.name === intent);
    if (intentObj) {
      const randomIndex = Math.floor(Math.random() * intentObj.responses.length);
      return intentObj.responses[randomIndex];
    }

    // Fallback responses for unknown queries
    const fallbackResponses = [
      "That's an interesting question! 🤔 While I specialize in career guidance, I'd love to help you with:\n\n• Career exploration and planning\n• Internship and job search strategies\n• Resume and portfolio building\n• College application guidance\n• Academic success tips\n• Project ideas for skill development\n\nWhat specific career topic can I assist you with?",
      "I'm here to help with your career journey! 🎯 I might not have the exact answer to that, but I can definitely help you with career-related topics like job searching, skill development, or academic planning. What career challenge are you facing?",
      "Great question! 💭 While that's outside my expertise area, I'm excellent at helping with career guidance. Whether you need advice on internships, college applications, resume building, or career planning, I'm here to help. What career topic interests you most?"
    ];
    
    const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
    return fallbackResponses[randomIndex];
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate processing delay for realistic feel
    setTimeout(() => {
      const { intent, confidence } = processMessage(inputValue);
      const response = generateResponse(intent);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        intent,
        confidence
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const clearConversation = () => {
    setMessages([]);
    toast({
      title: "Conversation Cleared",
      description: "Your chat history has been cleared successfully.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: "Hi there! 👋 I'm your AI Career Guidance Assistant. I'm here to help you with career planning, internships, college admissions, resume building, and academic success. What would you like to explore today?",
      sender: 'bot',
      timestamp: new Date(),
      intent: 'greeting',
      confidence: 1.0
    };
    setMessages([welcomeMessage]);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero p-6 text-primary-foreground shadow-glow">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Career Guidance Assistant</h1>
              <p className="text-primary-foreground/80">
                Your AI-powered mentor for career success
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              Career Planning
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              Internships
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              Resume Building
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              College Admissions
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <Card className="h-full flex flex-col shadow-card">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full shrink-0",
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  )}>
                    {message.sender === 'user' ? 
                      <User className="h-4 w-4" /> : 
                      <Bot className="h-4 w-4" />
                    }
                  </div>
                  <div className={cn(
                    "max-w-[80%] space-y-2",
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  )}>
                    <div className={cn(
                      "p-3 rounded-lg whitespace-pre-wrap",
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {message.text}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString()}
                      {message.intent && message.confidence && message.confidence > 0.3 && (
                        <Badge variant="outline" className="text-xs">
                          {message.intent} ({Math.round(message.confidence * 100)}%)
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="p-2 bg-accent text-accent-foreground rounded-full">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about careers, internships, college admissions, or resume tips..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!inputValue.trim() || isTyping}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={clearConversation}
                className="shrink-0"
                disabled={messages.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • Ask about careers, internships, academics, and more!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CareerChatbot;