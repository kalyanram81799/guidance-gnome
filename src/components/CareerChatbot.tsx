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
  Clock,
  Brain,
  Award,
  Target,
  Globe,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  Lightbulb
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
      name: 'career_exploration',
      keywords: ['career path', 'career options', 'what career', 'which field', 'career suggestion', 'holland code', 'mbti', 'personality test', 'career assessment', 'trending careers', 'government job', 'private job', 'technical job', 'non-technical'],
      responses: [
        "🔍 **Career Exploration Made Easy!**\n\n**Trending Career Domains:**\n• **Technology**: Software Development, Data Science, AI/ML, Cybersecurity\n• **Healthcare**: Medicine, Nursing, Medical Technology, Biotechnology\n• **Finance**: Investment Banking, Financial Analysis, Fintech\n• **Design**: UX/UI Design, Graphic Design, Product Design\n• **Civil Services**: IAS, IPS, Government Administration\n• **Research**: Scientific Research, Market Research, Academic Research\n\n**Career Assessment Tools:**\n• Holland Code (RIASEC) - Matches interests to careers\n• MBTI Personality Test - Aligns personality with roles\n• Skills Assessment - Identifies strengths\n\nWhat domain interests you most? I can provide detailed guidance!",
        "🎯 **Government vs Private Jobs Comparison:**\n\n**Government Jobs:**\n✅ Job security and stability\n✅ Good work-life balance\n✅ Pension and benefits\n✅ Social respect and impact\n❌ Lower initial salaries\n❌ Slower career progression\n\n**Private Jobs:**\n✅ Higher salary potential\n✅ Faster career growth\n✅ Skill development opportunities\n✅ Performance-based rewards\n❌ Less job security\n❌ Higher work pressure\n\n**Technical vs Non-Technical:**\n• **Technical**: Programming, Engineering, Medicine, Research\n• **Non-Technical**: Management, Sales, HR, Marketing, Administration\n\nWhich path aligns with your interests and goals?",
        "🚀 **Emerging Career Opportunities 2024:**\n\n**High-Demand Fields:**\n• **AI/ML Engineer**: ₹8-25 LPA\n• **Data Scientist**: ₹6-20 LPA\n• **Cybersecurity Analyst**: ₹5-18 LPA\n• **Cloud Solutions Architect**: ₹10-30 LPA\n• **Digital Marketing Specialist**: ₹4-15 LPA\n• **UX/UI Designer**: ₹5-20 LPA\n• **Sustainability Consultant**: ₹6-18 LPA\n• **Blockchain Developer**: ₹8-25 LPA\n\n**Career Assessment Steps:**\n1. Take a personality test (16Personalities.com)\n2. Identify your core interests and values\n3. Research day-to-day responsibilities\n4. Consider growth prospects and salary\n5. Talk to professionals in the field\n\nWhich career area would you like to explore deeper?"
      ],
      icon: Brain
    },
    {
      name: 'courses_education',
      keywords: ['course', 'degree', 'b.tech', 'b.sc', 'mba', 'college', 'university', 'undergraduate', 'postgraduate', 'certification', 'diploma', 'coursera', 'udemy', 'entrance exam', 'jee', 'neet', 'gate'],
      responses: [
        "🎓 **Education Pathway Recommendations:**\n\n**Undergraduate Courses:**\n• **Engineering (B.Tech)**: Computer Science, Electrical, Mechanical, Civil\n• **Science (B.Sc)**: Physics, Chemistry, Mathematics, Biology\n• **Commerce (B.Com)**: Accounting, Finance, Business Studies\n• **Arts (B.A)**: Psychology, Economics, Literature, History\n• **Professional**: BBA, BCA, B.Arch, B.Des\n\n**Postgraduate Options:**\n• **MBA**: Marketing, Finance, HR, Operations, Analytics\n• **M.Tech**: Specialized engineering fields\n• **M.Sc**: Research-oriented science fields\n• **Other**: LLM, MCA, M.Des, MA\n\n**Top Certifications:**\n• **Tech**: AWS, Google Cloud, Microsoft Azure\n• **Data**: Google Analytics, Tableau, Power BI\n• **Digital**: Google Ads, Facebook Blueprint\n• **Project Management**: PMP, Scrum Master\n\nWhat's your current education level and interests?",
        "📚 **Course Selection Based on Career Goals:**\n\n**For Software Development:**\n• B.Tech Computer Science\n• BCA + MCA\n• Online: Full-Stack Development (6-12 months)\n\n**For Data Science:**\n• B.Tech CS/Statistics + M.Sc Data Science\n• Online: Data Science Bootcamp (8-12 months)\n• Certifications: Google Data Analytics, IBM Data Science\n\n**For Business/Management:**\n• BBA + MBA\n• B.Com + MBA\n• Online: Business Analytics, Digital Marketing\n\n**For Creative Fields:**\n• B.Des (Product/Graphic/Fashion)\n• B.F.A + M.F.A\n• Online: UI/UX Design, Digital Art\n\n**Learning Platforms:**\n• **Free**: Coursera, edX, Khan Academy, YouTube\n• **Paid**: Udemy, Pluralsight, LinkedIn Learning\n• **Coding**: FreeCodeCamp, Codecademy, LeetCode\n\nWhich career path are you considering?",
        "🏆 **College Selection Strategy:**\n\n**Based on Entrance Exams:**\n• **JEE Main/Advanced**: IITs, NITs, IIITs\n• **NEET**: AIIMS, Government Medical Colleges\n• **GATE**: IITs, IISc for M.Tech\n• **CAT**: IIMs, Top B-Schools\n• **CLAT**: National Law Universities\n\n**Alternative Pathways:**\n• State university entrance exams\n• Private college admissions\n• Merit-based admissions\n• Management quota (higher fees)\n\n**Key Factors to Consider:**\n1. **Academic Reputation**: Rankings, faculty quality\n2. **Placement Records**: Average salary, top recruiters\n3. **Infrastructure**: Labs, library, hostels\n4. **Location**: Home proximity, industry connections\n5. **Fees**: Affordability, scholarship options\n6. **Alumni Network**: Industry connections\n\n**College Research Tips:**\n• Check NIRF rankings\n• Visit college websites and social media\n• Connect with current students/alumni\n• Attend college fairs and webinars\n\nWhich entrance exam are you preparing for?"
      ],
      icon: GraduationCap
    },
    {
      name: 'skill_development',
      keywords: ['skills', 'technical skills', 'soft skills', 'programming', 'communication', 'learning platform', 'edx', 'coursera', 'youtube', 'skill building', 'competency'],
      responses: [
        "🛠️ **Essential Skills by Career Domain:**\n\n**Software Development:**\n• **Technical**: Programming (Python, Java, JavaScript), Data Structures, Algorithms, Git, Database Management\n• **Soft**: Problem-solving, Logical thinking, Team collaboration\n• **Platforms**: LeetCode, HackerRank, Codecademy, freeCodeCamp\n\n**Data Science:**\n• **Technical**: Python/R, SQL, Machine Learning, Statistics, Tableau/Power BI\n• **Soft**: Analytical thinking, Storytelling with data\n• **Platforms**: Kaggle, Coursera Data Science, edX MIT courses\n\n**Digital Marketing:**\n• **Technical**: Google Analytics, SEO/SEM, Social Media Tools, Content Management\n• **Soft**: Creativity, Communication, Market analysis\n• **Platforms**: Google Skillshop, HubSpot Academy, Facebook Blueprint\n\n**Business Management:**\n• **Technical**: Excel, PowerPoint, Project Management Tools, CRM\n• **Soft**: Leadership, Communication, Strategic thinking\n• **Platforms**: LinkedIn Learning, Coursera Business, MasterClass\n\nWhich domain would you like to develop skills for?",
        "📈 **Skill Development Roadmap:**\n\n**Phase 1: Foundation (Month 1-2)**\n• Identify your career interests\n• Learn basic technical skills for your field\n• Develop fundamental soft skills\n• Start building a learning habit\n\n**Phase 2: Intermediate (Month 3-6)**\n• Take online courses with certifications\n• Start small projects to apply knowledge\n• Join relevant communities and forums\n• Begin networking with professionals\n\n**Phase 3: Advanced (Month 6-12)**\n• Work on comprehensive projects\n• Contribute to open-source (for tech)\n• Seek internships or freelance work\n• Build a portfolio showcasing your skills\n\n**Learning Platforms by Category:**\n• **Free**: YouTube, Khan Academy, Coursera (audit), edX\n• **Affordable**: Udemy, Skillshare, Pluralsight\n• **Premium**: MasterClass, LinkedIn Learning Premium\n• **Specialized**: Codecademy (coding), Behance (design)\n\n**Skill Tracking Tips:**\n• Set weekly learning goals\n• Practice consistently (even 30 min/day)\n• Apply skills in real projects\n• Get feedback from peers/mentors\n\nWhat specific skill would you like to start with?",
        "🎯 **In-Demand Skills for 2024:**\n\n**Technical Skills:**\n• **Programming**: Python, JavaScript, React, Node.js\n• **Data**: SQL, Excel Advanced, Data Visualization\n• **Cloud**: AWS, Azure, Google Cloud Platform\n• **AI/ML**: Machine Learning, Natural Language Processing\n• **Design**: Figma, Adobe Creative Suite, UI/UX\n• **Digital**: SEO, Google Ads, Social Media Marketing\n\n**Soft Skills (Highly Valued):**\n• **Communication**: Written, Verbal, Presentation\n• **Leadership**: Team management, Decision-making\n• **Problem-solving**: Critical thinking, Innovation\n• **Adaptability**: Learning agility, Change management\n• **Emotional Intelligence**: Empathy, Self-awareness\n• **Time Management**: Productivity, Organization\n\n**Quick Skill Assessment:**\n1. Rate your current skills (1-10)\n2. Identify gaps based on dream job requirements\n3. Create a 3-month learning plan\n4. Find accountability partner or mentor\n5. Track progress weekly\n\n**Mini-Project Ideas by Skill:**\n• **Programming**: Build a personal website\n• **Data Analysis**: Analyze a dataset you're interested in\n• **Design**: Create social media templates\n• **Marketing**: Run a small digital campaign\n\nWhich skill area interests you most?"
      ],
      icon: Target
    },
    {
      name: 'internships',
      keywords: ['internship', 'intern', 'summer job', 'work experience', 'placement', 'training', 'internshala', 'linkedin jobs'],
      responses: [
        "🚀 **Complete Internship Strategy:**\n\n**Best Platforms for Internships:**\n• **Internshala**: Largest database of internships in India\n• **LinkedIn**: Professional networking + job opportunities\n• **Indeed**: Wide range of opportunities\n• **AngelList**: Startup internships\n• **Company Websites**: Direct applications\n• **College Placement Cell**: On-campus opportunities\n• **Unstop (formerly Dare2Compete)**: Contests + internships\n\n**Application Timeline:**\n• **Summer Internships**: Apply 4-6 months early (Oct-Dec)\n• **Winter Internships**: Apply in Aug-Sep\n• **Rolling Applications**: Year-round for startups\n\n**Application Essentials:**\n• Tailored resume for each application\n• Compelling cover letter\n• Portfolio/GitHub profile\n• Strong LinkedIn profile\n• Reference letters (if available)\n\n**Types of Internships:**\n• **Paid**: ₹5,000-₹50,000/month\n• **Unpaid**: Certificate + experience\n• **Remote**: Work from anywhere\n• **On-site**: Office-based experience\n\nWhich field are you looking for internships in?",
        "💼 **Internship Success Formula:**\n\n**Before Applying:**\n1. **Skill Preparation**: Build relevant skills for 2-3 months\n2. **Resume Optimization**: ATS-friendly format, relevant keywords\n3. **Portfolio Building**: 2-3 quality projects\n4. **Network Building**: Connect with professionals on LinkedIn\n\n**During Applications:**\n• Apply to 50-100 positions for better odds\n• Customize each application\n• Follow up professionally after 1 week\n• Prepare for various interview formats\n\n**Interview Preparation:**\n• **Technical**: Coding problems, domain knowledge\n• **Behavioral**: STAR method for examples\n• **Company Research**: Mission, values, recent news\n• **Questions to Ask**: Growth opportunities, learning curve\n\n**During Internship:**\n• Be proactive and ask questions\n• Document your learning and achievements\n• Network with colleagues and seniors\n• Seek feedback regularly\n• Aim for a full-time offer or strong recommendation\n\n**Post-Internship:**\n• Update resume with new skills/achievements\n• Request LinkedIn recommendations\n• Maintain professional relationships\n• Share experience with juniors\n\nNeed help with any specific aspect of internship preparation?",
        "🎯 **Domain-Specific Internship Guide:**\n\n**Technology Internships:**\n• **Companies**: Google, Microsoft, Amazon, startups\n• **Preparation**: Data structures, algorithms, system design\n• **Duration**: 8-12 weeks, often summer\n• **Compensation**: ₹25,000-₹1,00,000/month\n\n**Finance Internships:**\n• **Companies**: Goldman Sachs, JP Morgan, Indian banks\n• **Preparation**: Financial modeling, Excel, market knowledge\n• **Duration**: 6-10 weeks\n• **Compensation**: ₹15,000-₹75,000/month\n\n**Marketing Internships:**\n• **Companies**: Unilever, P&G, digital agencies\n• **Preparation**: Campaign analysis, creative thinking\n• **Duration**: 6-12 weeks\n• **Compensation**: ₹8,000-₹40,000/month\n\n**Research Internships:**\n• **Organizations**: IISc, TIFR, universities, labs\n• **Preparation**: Strong academic background, research proposal\n• **Duration**: 8-16 weeks\n• **Compensation**: ₹5,000-₹25,000/month + certificate\n\n**International Opportunities:**\n• **Programs**: MITACS (Canada), DAAD (Germany), Erasmus+ (Europe)\n• **Requirements**: Strong academics, research interest\n• **Benefits**: Global exposure, cultural exchange\n\nWhich domain internship interests you most?"
      ],
      icon: Briefcase
    },
    {
      name: 'resume_interview',
      keywords: ['resume', 'cv', 'interview', 'linkedin profile', 'github portfolio', 'ats', 'job application', 'cover letter'],
      responses: [
        "📄 **ATS-Optimized Resume Building:**\n\n**Essential Resume Sections:**\n1. **Header**: Name, phone, email, LinkedIn, GitHub\n2. **Professional Summary**: 2-3 lines highlighting key strengths\n3. **Education**: Degree, institution, GPA (if >3.5), relevant coursework\n4. **Experience**: Internships, jobs, projects (use action verbs)\n5. **Technical Skills**: Programming languages, tools, technologies\n6. **Projects**: 2-3 significant projects with impact metrics\n7. **Achievements**: Awards, certifications, publications\n8. **Extracurricular**: Leadership roles, volunteer work\n\n**ATS-Friendly Tips:**\n• Use standard fonts (Arial, Calibri, Times New Roman)\n• Include keywords from job description\n• Use bullet points, not paragraphs\n• Save as both PDF and Word format\n• Avoid graphics, tables, headers/footers\n• Use standard section headings\n\n**Action Verbs that Impress:**\n• Developed, Implemented, Optimized, Analyzed\n• Led, Managed, Coordinated, Facilitated\n• Increased, Reduced, Improved, Achieved\n\nNeed help with any specific resume section?",
        "🌟 **LinkedIn Profile Optimization:**\n\n**Profile Photo:**\n• Professional headshot with good lighting\n• Clear face, appropriate attire\n• Friendly, confident expression\n\n**Headline (120 characters):**\n• More than just job title\n• Include key skills and value proposition\n• Example: \"Computer Science Student | Full-Stack Developer | AI Enthusiast\"\n\n**Summary (2000 characters):**\n• Tell your professional story\n• Highlight achievements and goals\n• Include relevant keywords\n• Call-to-action for connections\n\n**Experience Section:**\n• Use the same format as resume\n• Add media (project screenshots, documents)\n• Regular updates with new accomplishments\n\n**Skills & Endorsements:**\n• Add 5-10 most relevant skills\n• Ask connections for endorsements\n• Endorse others to build relationships\n\n**GitHub Portfolio Tips:**\n• Clean, organized repository structure\n• Detailed README files for each project\n• Regular commits showing consistency\n• Pin your best repositories\n• Include live project links\n\nWhich platform would you like to optimize first?",
        "🎤 **Interview Mastery Guide:**\n\n**Common Interview Questions by Category:**\n\n**Behavioral (STAR Method):**\n• \"Tell me about a challenging project\"\n• \"Describe a time you showed leadership\"\n• \"How do you handle conflicts?\"\n• \"Why do you want this role?\"\n\n**Technical (Domain-Specific):**\n• **Software**: Coding problems, system design\n• **Data Science**: SQL queries, ML concepts\n• **Finance**: Market analysis, financial modeling\n• **Marketing**: Campaign strategies, metrics\n\n**Company-Specific:**\n• \"Why our company?\"\n• \"How do you align with our values?\"\n• \"What do you know about our products?\"\n\n**Interview Types:**\n• **Phone/Video Screening**: Basic background check\n• **Technical Round**: Skills assessment\n• **HR Round**: Cultural fit, salary discussion\n• **Final Round**: Senior management, decision makers\n\n**Preparation Strategy:**\n1. Research company thoroughly (website, news, competitors)\n2. Practice with mock interviews\n3. Prepare 3-5 thoughtful questions to ask\n4. Plan your outfit and setup (for virtual)\n5. Arrive 10-15 minutes early\n\n**Post-Interview:**\n• Send thank-you email within 24 hours\n• Reiterate interest and key qualifications\n• Follow up after stated timeline\n\nWhich type of interview would you like to prepare for?"
      ],
      icon: FileText
    },
    {
      name: 'exams_certifications',
      keywords: ['entrance exam', 'jee', 'neet', 'upsc', 'gate', 'cat', 'gre', 'ielts', 'certification', 'aws', 'google cloud', 'microsoft'],
      responses: [
        "📖 **Major Entrance Exams Guide:**\n\n**Engineering Exams:**\n• **JEE Main**: April & January, for NITs, IIITs, CFTIs\n• **JEE Advanced**: May, for IITs (top 2.5 lakh JEE Main qualifiers)\n• **BITSAT**: Online exam for BITS colleges\n• **VITEEE**: For VIT universities\n\n**Medical Exams:**\n• **NEET UG**: May, for MBBS/BDS admissions\n• **NEET PG**: For MD/MS admissions\n• **AIIMS**: Separate exam for AIIMS institutes\n\n**Management Exams:**\n• **CAT**: November, for IIMs and top B-schools\n• **XAT**: January, for XLRI and other colleges\n• **SNAP**: December, for Symbiosis institutes\n• **MAT**: Multiple times, for various B-schools\n\n**Civil Services:**\n• **UPSC CSE**: Prelims (June), Mains (October), Interview\n• **SSC CGL**: For Group B & C central government jobs\n• **Banking**: IBPS PO, SBI PO, RBI Grade B\n\n**Preparation Timeline:**\n• **1-2 years**: JEE Advanced, NEET, UPSC\n• **6-12 months**: CAT, GATE, other exams\n• **3-6 months**: State-level exams\n\nWhich exam are you preparing for?",
        "🏆 **Professional Certifications Worth Pursuing:**\n\n**Cloud Computing:**\n• **AWS**: Solutions Architect (₹8-20 LPA boost)\n• **Azure**: Azure Fundamentals to Expert level\n• **Google Cloud**: Associate to Professional level\n• **Multi-Cloud**: Kubernetes, Docker certifications\n\n**Data & Analytics:**\n• **Google**: Data Analytics, Digital Marketing\n• **Microsoft**: Power BI, Azure Data certifications\n• **Tableau**: Desktop Specialist to Expert\n• **SAS**: Statistical Analysis certification\n\n**Programming & Development:**\n• **Oracle**: Java certifications (OCA, OCP)\n• **Microsoft**: C# and .NET certifications\n• **Red Hat**: Linux system administration\n• **Cisco**: Networking certifications (CCNA, CCNP)\n\n**Project Management:**\n• **PMI**: PMP (Project Management Professional)\n• **Scrum**: Certified ScrumMaster (CSM)\n• **Agile**: Various agile methodologies\n\n**Digital Marketing:**\n• **Google**: Ads, Analytics, Digital Marketing\n• **Facebook**: Blueprint certifications\n• **HubSpot**: Inbound marketing, sales\n\n**Certification Benefits:**\n• 15-30% salary increase potential\n• Enhanced resume credibility\n• Structured learning path\n• Industry recognition\n• Networking opportunities\n\nWhich certification aligns with your career goals?",
        "🎯 **International Exam Preparation:**\n\n**Study Abroad Exams:**\n\n**English Proficiency:**\n• **IELTS**: Required for UK, Australia, Canada\n• **TOEFL**: Preferred for USA universities\n• **PTE**: Alternative to IELTS/TOEFL\n• **Duolingo**: Accepted by some universities\n\n**Graduate Studies:**\n• **GRE**: For MS programs in USA, Canada\n• **GMAT**: For MBA programs globally\n• **LSAT**: For law schools in USA\n• **MCAT**: For medical schools in USA\n\n**Country-Specific:**\n• **SAT**: Undergraduate admissions in USA\n• **ACT**: Alternative to SAT\n• **A-Levels**: For UK undergraduate programs\n\n**Preparation Strategy:**\n1. **Target Score Research**: Check university requirements\n2. **Diagnostic Test**: Identify strengths/weaknesses\n3. **Study Plan**: 3-6 months preparation\n4. **Mock Tests**: Regular practice tests\n5. **Multiple Attempts**: Plan for 2-3 attempts if needed\n\n**Exam Costs (Approximate):**\n• IELTS: ₹15,500\n• TOEFL: ₹15,000\n• GRE: ₹18,000\n• GMAT: ₹19,000\n\n**Scholarships to Consider:**\n• Fulbright (USA)\n• Chevening (UK)\n• DAAD (Germany)\n• Australia Awards\n\nWhich international exam interests you?"
      ],
      icon: Award
    },
    {
      name: 'job_search',
      keywords: ['job search', 'job hunting', 'employment', 'hiring', 'career opportunities', 'job application', 'networking', 'job portal'],
      responses: [
        "🔍 **Comprehensive Job Search Strategy:**\n\n**Top Job Portals in India:**\n• **Naukri.com**: Largest job portal with 5+ crore users\n• **LinkedIn**: Professional networking + premium job opportunities\n• **Indeed**: Global platform with local opportunities\n• **Monster**: Established portal with diverse listings\n• **Shine**: Tech-focused job platform\n• **Glassdoor**: Job search + company reviews + salary insights\n• **AngelList**: Startup ecosystem jobs\n• **Internshala**: Internships transitioning to full-time\n\n**Company Career Pages:**\n• Check websites of target companies directly\n• Set up job alerts for specific companies\n• Follow companies on LinkedIn for updates\n\n**Networking Strategies:**\n• Alumni networks from college\n• Professional associations in your field\n• Industry events and conferences\n• LinkedIn connections and engagement\n• Referral programs (highest success rate)\n\n**Application Tracking:**\n• Maintain spreadsheet with application details\n• Follow up timeline: 1 week, 2 weeks, 1 month\n• Track response rates and optimize approach\n\nWhich industry are you targeting for your job search?",
        "💼 **Job Application Success Formula:**\n\n**Application Strategy:**\n1. **Quality over Quantity**: 10 tailored applications > 50 generic ones\n2. **Job Description Analysis**: Match 70%+ requirements\n3. **Company Research**: Understand culture, values, recent news\n4. **Network Leverage**: Find internal connections via LinkedIn\n5. **Multiple Channels**: Job portals + company websites + networking\n\n**Application Materials:**\n• **Resume**: ATS-optimized, keyword-rich\n• **Cover Letter**: Company-specific, value proposition focused\n• **Portfolio**: For creative/technical roles\n• **References**: 2-3 professional contacts\n\n**Timeline Management:**\n• **Week 1-2**: Resume/LinkedIn optimization\n• **Week 3-4**: Apply to 15-20 positions\n• **Week 5-6**: Follow up, prepare for interviews\n• **Week 7-8**: Interview rounds, negotiate offers\n\n**Salary Negotiation Tips:**\n• Research market rates (Glassdoor, PayScale)\n• Consider total compensation (salary + benefits)\n• Negotiate after job offer, not during interview\n• Be prepared to justify your ask\n• Consider non-monetary benefits\n\n**Red Flags to Avoid:**\n• Upfront payment requests\n• Unclear job descriptions\n• Unprofessional communication\n• Too-good-to-be-true offers\n\nNeed help with any specific aspect of job hunting?",
        "🎯 **Industry-Specific Job Search Tips:**\n\n**Technology Sector:**\n• **Platforms**: AngelList, Stack Overflow Jobs, GitHub Jobs\n• **Skills**: Keep GitHub active, contribute to open source\n• **Network**: Tech meetups, hackathons, online communities\n• **Preparation**: System design, coding interviews\n\n**Finance Sector:**\n• **Platforms**: eFinancialCareers, Indeed Finance section\n• **Skills**: Financial modeling, Excel mastery, market knowledge\n• **Network**: CFA Institute, finance professionals on LinkedIn\n• **Preparation**: Technical + market awareness interviews\n\n**Consulting:**\n• **Platforms**: Company websites (McKinsey, BCG, Bain)\n• **Skills**: Case study preparation, analytical thinking\n• **Network**: Alumni in consulting, business school connections\n• **Preparation**: Case interviews, business acumen\n\n**Healthcare:**\n• **Platforms**: Healthcare-specific job boards\n• **Skills**: Relevant certifications, continuing education\n• **Network**: Medical associations, hospital connections\n• **Preparation**: Technical knowledge + patient care focus\n\n**Government Jobs:**\n• **Platforms**: Sarkari Result, government websites\n• **Process**: Written exam + interview + document verification\n• **Preparation**: Current affairs, domain knowledge\n• **Timeline**: Longer process (6-18 months)\n\n**Startup Ecosystem:**\n• **Platforms**: AngelList, startup job boards\n• **Skills**: Versatility, entrepreneurial mindset\n• **Network**: Startup events, accelerator networks\n• **Preparation**: Cultural fit, flexibility emphasis\n\nWhich sector matches your career interests?"
      ],
      icon: Users
    },
    {
      name: 'mentorship_counseling',
      keywords: ['stress', 'anxiety', 'time management', 'study plan', 'motivation', 'counseling', 'mental health', 'work-life balance', 'pressure'],
      responses: [
        "🧠 **Student Stress Management & Mental Wellness:**\n\n**Common Stress Triggers:**\n• Academic pressure and competition\n• Career uncertainty and future anxiety\n• Financial constraints and family expectations\n• Social media comparison and peer pressure\n• Time management challenges\n\n**Stress Management Techniques:**\n• **Mindfulness**: 10-minute daily meditation (Headspace, Calm apps)\n• **Exercise**: 30 minutes daily physical activity\n• **Sleep Hygiene**: 7-8 hours quality sleep\n• **Breathing Exercises**: 4-7-8 technique for instant calm\n• **Time Blocking**: Structured daily schedule\n\n**When to Seek Professional Help:**\n• Persistent anxiety affecting daily life\n• Sleep or appetite changes\n• Difficulty concentrating for extended periods\n• Social withdrawal or isolation\n• Thoughts of self-harm\n\n**Support Resources:**\n• **College Counseling Centers**: Free for students\n• **Helplines**: KIRAN (1800-599-0019), Vandrevala Foundation\n• **Online Therapy**: BetterHelp, Talkspace, ePsyClinic\n• **Support Groups**: Peer counseling, study groups\n\n**Building Resilience:**\n• Set realistic, achievable goals\n• Celebrate small wins daily\n• Maintain social connections\n• Practice gratitude journaling\n• Develop growth mindset\n\nWhat specific challenge would you like support with?",
        "⏰ **Effective Time Management for Students:**\n\n**Time Management Framework:**\n\n**1. Priority Matrix (Eisenhower Method):**\n• **Urgent + Important**: Exams, deadlines\n• **Important + Not Urgent**: Skill building, planning\n• **Urgent + Not Important**: Some meetings, interruptions\n• **Neither**: Social media, excessive entertainment\n\n**2. Time Blocking Technique:**\n• **6-9 AM**: High-energy tasks (studying difficult subjects)\n• **9-12 PM**: Creative work (projects, assignments)\n• **12-1 PM**: Break and lunch\n• **1-4 PM**: Routine tasks (emails, planning)\n• **4-6 PM**: Physical activity, relaxation\n• **6-8 PM**: Review and light study\n• **8-10 PM**: Personal time, hobbies\n\n**3. Pomodoro Technique:**\n• 25 minutes focused work\n• 5-minute break\n• Repeat 4 cycles, then 30-minute break\n\n**Study Planning:**\n• **Weekly Planning**: Sunday planning session\n• **Daily Review**: 10 minutes before bed\n• **Monthly Goals**: Bigger picture tracking\n• **Semester Planning**: Major deadlines and milestones\n\n**Productivity Tools:**\n• **Planning**: Google Calendar, Notion, Todoist\n• **Focus**: Forest app, Cold Turkey blocker\n• **Tracking**: RescueTime, Toggl\n\nNeed help creating a personalized study schedule?",
        "📚 **Comprehensive Study Plan Creation:**\n\n**Study Plan Framework:**\n\n**Phase 1: Assessment (Week 1)**\n• Identify all subjects and topics\n• Assess current knowledge level (1-10 scale)\n• Calculate available study time\n• Set realistic goals for each subject\n\n**Phase 2: Planning (Week 1-2)**\n• Allocate time based on difficulty and importance\n• Create daily and weekly schedules\n• Plan revision cycles (review after 1 day, 1 week, 1 month)\n• Include buffer time for unexpected challenges\n\n**Phase 3: Execution (Ongoing)**\n• Follow the schedule consistently\n• Track progress weekly\n• Adjust plan based on performance\n• Maintain work-life balance\n\n**Study Techniques by Subject:**\n• **Mathematics/Physics**: Practice problems daily\n• **Theory Subjects**: Mind maps, summary notes\n• **Languages**: Daily reading, writing practice\n• **Memorization**: Flashcards, spaced repetition\n\n**Revision Strategy:**\n• **Active Recall**: Test yourself without notes\n• **Spaced Repetition**: Review at increasing intervals\n• **Teaching Method**: Explain concepts to others\n• **Practice Tests**: Simulate exam conditions\n\n**Motivation Maintenance:**\n• Set weekly achievable targets\n• Reward yourself for milestones\n• Join study groups for accountability\n• Visualize success and career goals\n• Take regular breaks and maintain hobbies\n\n**Common Pitfalls to Avoid:**\n• Over-ambitious planning\n• Not including breaks and relaxation\n• Comparing with others' progress\n• Neglecting health and sleep\n• All-or-nothing thinking\n\nWhich subject or exam would you like to create a study plan for?"
      ],
      icon: Lightbulb
    },
    {
      name: 'academics',
      keywords: ['study', 'grades', 'gpa', 'exam', 'test', 'academic', 'course', 'subject', 'learning', 'scholarship'],
      responses: [
        "📚 **Academic Excellence Strategy:**\n\n**GPA Improvement Plan:**\n• **Attend all classes**: 80% of success is showing up\n• **Active participation**: Ask questions, engage in discussions\n• **Note-taking system**: Cornell notes, mind mapping\n• **Regular review**: Daily 30-minute review of class notes\n• **Office hours**: Build relationships with professors\n\n**Study Techniques that Work:**\n• **Active Recall**: Test yourself regularly\n• **Spaced Repetition**: Review material at increasing intervals\n• **Feynman Technique**: Explain concepts in simple terms\n• **Interleaving**: Mix different types of problems/subjects\n• **Elaborative Interrogation**: Ask 'why' and 'how' questions\n\n**Exam Preparation Strategy:**\n1. **6 weeks before**: Create study schedule, gather materials\n2. **4 weeks before**: Complete first round of syllabus\n3. **2 weeks before**: Focus on weak areas, practice tests\n4. **1 week before**: Final revision, mock exams\n5. **Day before**: Light review, relaxation, early sleep\n\n**Academic Support Resources:**\n• **Tutoring centers**: Free help from senior students\n• **Study groups**: Collaborative learning\n• **Online resources**: Khan Academy, Coursera, YouTube\n• **Professor office hours**: Clarify doubts directly\n• **Academic advisors**: Course planning guidance\n\nWhich subject needs your immediate attention?",
        "🏆 **Scholarship & Financial Aid Guide:**\n\n**Government Scholarships:**\n• **National Scholarship Portal**: Single platform for all schemes\n• **Merit-based**: Based on academic performance\n• **Need-based**: For economically weaker sections\n• **Minority scholarships**: For SC/ST/OBC students\n• **Girl child education**: Specific schemes for female students\n\n**Private Scholarships:**\n• **Corporate CSR**: Tata, Reliance, Aditya Birla scholarships\n• **International**: Fulbright, Chevening, DAAD\n• **Field-specific**: Engineering, medical, arts scholarships\n• **State-specific**: Regional scholarship programs\n\n**Application Strategy:**\n• **Early application**: Most scholarships have early deadlines\n• **Multiple applications**: Apply to 10-15 relevant scholarships\n• **Strong essays**: Personal story, future goals, impact\n• **Recommendation letters**: From teachers, mentors\n• **Documentation**: Keep all certificates ready\n\n**Scholarship Search Platforms:**\n• **Buddy4Study**: Comprehensive scholarship database\n• **Scholarships.com**: International opportunities\n• **College-specific**: Check university websites\n• **Professional associations**: Field-specific scholarships\n\n**Financial Planning Tips:**\n• **Education loans**: Compare interest rates and terms\n• **Part-time work**: Campus jobs, freelancing\n• **Expense tracking**: Monitor and reduce unnecessary costs\n• **Emergency fund**: Save for unexpected expenses\n\n**Merit Scholarship Eligibility:**\n• **Academic performance**: Usually 85%+ in previous qualifying exam\n• **Entrance exam scores**: High percentiles in competitive exams\n• **Extracurricular activities**: Leadership, community service\n• **Financial need**: Family income criteria\n\nNeed help with scholarship applications or academic planning?",
        "🎯 **Research & Higher Studies Preparation:**\n\n**Research Opportunities for Students:**\n• **KVPY**: Science research fellowship\n• **INSPIRE**: Innovation in Science scholarship\n• **Summer Research Programs**: IISc, TIFR, IITs\n• **International programs**: MITACS, DAAD, NSF\n• **Industry research**: Corporate R&D internships\n\n**Building Research Profile:**\n• **Academic projects**: Go beyond curriculum requirements\n• **Conference presentations**: Present your work\n• **Publications**: Aim for journal papers\n• **Research methodology**: Learn statistical analysis tools\n• **Literature review**: Stay updated with latest research\n\n**PhD Preparation:**\n• **Strong academic record**: High GPA/percentage\n• **Research experience**: Publications, projects\n• **Standardized tests**: GRE, GATE (as applicable)\n• **Statement of Purpose**: Clear research interests\n• **Letters of Recommendation**: From research mentors\n\n**International Higher Studies:**\n• **Country selection**: Based on program strength, cost, culture\n• **University research**: Rankings, faculty, funding\n• **Application timeline**: Start 1.5-2 years early\n• **Financial planning**: Tuition, living costs, scholarships\n• **Visa requirements**: Documentation, interview preparation\n\n**Academic Writing Skills:**\n• **Research papers**: Structure, citations, peer review\n• **Grant proposals**: Funding application writing\n• **Technical communication**: Clear, concise writing\n• **Presentation skills**: Conference talks, poster sessions\n\n**Networking in Academia:**\n• **Conference attendance**: Meet researchers in your field\n• **Academic social media**: ResearchGate, Academia.edu\n• **Collaboration opportunities**: Cross-institutional projects\n• **Mentorship**: Find senior researchers as guides\n\nWhat aspect of academic development interests you most?"
      ],
      icon: BookOpen
    },
    {
      name: 'project_ideas',
      keywords: ['project', 'portfolio', 'coding', 'programming', 'development', 'build', 'create', 'mini project'],
      responses: [
        "💻 **Project Ideas by Skill Level & Domain:**\n\n**Beginner Projects (1-2 months):**\n• **Web Development**: Personal portfolio website, simple blog\n• **Mobile App**: Calculator, to-do list, weather app\n• **Data Analysis**: Analyze your own data (expenses, habits)\n• **Machine Learning**: Iris classification, house price prediction\n• **Game Development**: Tic-tac-toe, simple puzzle games\n• **IoT**: Smart home automation basics\n\n**Intermediate Projects (2-4 months):**\n• **Full-Stack Web App**: E-commerce mockup, social media clone\n• **Data Science**: Predictive analytics dashboard\n• **Mobile Development**: Location-based app, fitness tracker\n• **AI/ML**: Chatbot, recommendation system\n• **DevOps**: CI/CD pipeline setup\n• **Blockchain**: Simple cryptocurrency, smart contracts\n\n**Advanced Projects (4-6 months):**\n• **Distributed Systems**: Microservices architecture\n• **AI Research**: Novel ML algorithm implementation\n• **Open Source**: Contribute to major projects\n• **Startup MVP**: Complete product with users\n• **Research Project**: Academic paper + implementation\n\n**Domain-Specific Ideas:**\n• **FinTech**: Personal finance tracker, investment analyzer\n• **HealthTech**: Medical appointment system, fitness coach\n• **EdTech**: Learning management system, quiz platform\n• **AgriTech**: Crop monitoring, weather prediction\n\nWhat's your current skill level and preferred domain?",
        "🚀 **Project Planning & Execution Framework:**\n\n**Project Selection Criteria:**\n• **Personal Interest**: Choose something you're passionate about\n• **Market Relevance**: Solve real-world problems\n• **Skill Development**: Learn new technologies/frameworks\n• **Portfolio Value**: Impressive for employers/clients\n• **Completion Timeline**: Realistic scope for available time\n\n**Project Phases:**\n\n**Phase 1: Planning (Week 1)**\n• Define problem statement and target users\n• Research existing solutions and competitors\n• Choose technology stack\n• Create wireframes/mockups\n• Break down into smaller tasks\n\n**Phase 2: Development (Weeks 2-8)**\n• Set up development environment\n• Implement core features first\n• Regular commits to version control\n• Weekly progress review and adjustment\n• Document code and decisions\n\n**Phase 3: Testing & Deployment (Week 9-10)**\n• User testing with friends/family\n• Bug fixes and performance optimization\n• Deploy to cloud platform (Heroku, Netlify, AWS)\n• Write comprehensive README\n• Create demo video/presentation\n\n**Documentation Essentials:**\n• **README**: Project overview, setup instructions\n• **Code Comments**: Explain complex logic\n• **API Documentation**: If applicable\n• **User Guide**: How to use your application\n• **Future Enhancements**: Planned improvements\n\n**Technology Stack Suggestions:**\n• **Frontend**: React, Vue.js, Angular\n• **Backend**: Node.js, Python Flask/Django, Java Spring\n• **Database**: MongoDB, PostgreSQL, Firebase\n• **Mobile**: React Native, Flutter, Swift/Kotlin\n• **ML/AI**: Python (TensorFlow, PyTorch), R\n\nNeed help planning your next project?",
        "🎯 **Industry-Aligned Project Ideas:**\n\n**Software Development:**\n• **Task Management System**: Jira/Trello clone with team collaboration\n• **Code Review Platform**: GitHub-like interface with automated testing\n• **API Gateway**: Microservices communication hub\n• **Real-time Chat Application**: Video calls, file sharing\n• **Progressive Web App**: Offline functionality, push notifications\n\n**Data Science & Analytics:**\n• **Customer Churn Prediction**: ML model for business retention\n• **Social Media Sentiment Analysis**: Real-time mood tracking\n• **Stock Market Predictor**: Time series analysis with LSTM\n• **Recommendation Engine**: Netflix/Amazon-style suggestions\n• **A/B Testing Platform**: Statistical significance calculator\n\n**Cybersecurity:**\n• **Vulnerability Scanner**: Automated security assessment tool\n• **Password Manager**: Encrypted storage with 2FA\n• **Network Monitor**: Intrusion detection system\n• **Secure File Transfer**: End-to-end encryption\n• **Phishing Detection**: Email security analyzer\n\n**Digital Marketing:**\n• **SEO Analyzer**: Website optimization recommendations\n• **Social Media Dashboard**: Multi-platform management\n• **Email Campaign Manager**: Automation and analytics\n• **Competitor Analysis Tool**: Market research automation\n• **Content Performance Tracker**: Engagement metrics\n\n**Emerging Technologies:**\n• **AR/VR Application**: Educational or entertainment\n• **Blockchain DApp**: Decentralized application\n• **IoT Dashboard**: Smart device management\n• **Voice Assistant**: Custom skills development\n• **Computer Vision**: Image recognition application\n\n**Project Showcase Tips:**\n• Live demo link (GitHub Pages, Heroku)\n• Video demonstration (Loom, YouTube)\n• Technical blog post about development process\n• LinkedIn post with project highlights\n• Include metrics (users, performance, impact)\n\nWhich industry/technology excites you most for your next project?"
      ],
      icon: Lightbulb
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
              Career Exploration
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              Skill Development
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              Internships & Jobs
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              Resume & Interview
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              Certifications
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              Academic Excellence
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-primary-foreground border-white/20">
              Mental Wellness
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
                placeholder="Ask about careers, internships, skills, certifications, academics, or mental wellness..."
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
              Press Enter to send • Ask about career exploration, skill development, mental wellness & more!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CareerChatbot;