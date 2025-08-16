import {
  // User & Contact Icons
  Users,
  User,
  UserCheck,
  UserPlus,
  UserX,
  Contact,
  Crown,
  Shield,
  
  // Technology & Development Icons
  Code,
  Database,
  Server,
  Cloud,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Zap,
  Settings,
  Cog,
  Wrench,
  Wrench as Tool,
  
  // Business & Finance Icons
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  LineChart,
  Calculator,
  CreditCard,
  Banknote,
  Coins,
  Receipt,
  Target,
  
  // Communication & Social Icons
  MessageSquare,
  MessageCircle,
  Mail,
  Phone,
  Video,
  Mic,
  Send,
  Share,
  Link,
  Globe,
  Wifi,
  
  // Navigation & Action Icons
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  Square,
  
  // Document & Content Icons
  FileText,
  File,
  Folder,
  FolderOpen,
  Download,
  Upload,
  Save,
  Edit,
  Copy,
  Clipboard,
  BookOpen,
  Book,
  
  // Time & Calendar Icons
  Clock,
  Calendar,
  CalendarDays,
  Timer,
  Hourglass,
  
  // Location & Geography Icons
  MapPin,
  Map,
  Navigation,
  Compass,
  
  // Status & Feedback Icons
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  HelpCircle,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  
  // Security & Privacy Icons
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  
  // Media & Entertainment Icons
  Play,
  Pause,
  Square as Stop,
  Volume2,
  VolumeX,
  Image,
  Camera,
  
  // Shopping & Commerce Icons
  ShoppingCart,
  Package,
  Truck,
  Store,
  Briefcase,
  
  // Building & Organization Icons
  Building,
  Building2,
  Home,
  Factory,
  
  // Research & Intelligence Icons
  Brain,
  Lightbulb,
  Microscope,
  Telescope,
  FlaskConical,
  ChartBar,
  Activity,
  Layers,
  GitBranch,
  Workflow,
  
  // Integration & Connectivity Icons
  Puzzle,
  Plug,
  Cable,
  Router,
  Network,
  
  // Growth & Expansion Icons
  Rocket,
  Expand,
  
  // Competitive & Analysis Icons
  Crosshair,
  Radar,
  Binoculars,
  Scale,
  
  type LucideIcon
} from 'lucide-react';

// Icon name to component mapping
export const iconMap: Record<string, LucideIcon> = {
  // User & Contact Icons
  'users': Users,
  'user': User,
  'user-check': UserCheck,
  'user-plus': UserPlus,
  'user-x': UserX,
  'contact': Contact,
  'crown': Crown,
  'shield': Shield,
  
  // Technology & Development Icons
  'code': Code,
  'database': Database,
  'server': Server,
  'cloud': Cloud,
  'cpu': Cpu,
  'hard-drive': HardDrive,
  'monitor': Monitor,
  'smartphone': Smartphone,
  'tablet': Tablet,
  'laptop': Laptop,
  'zap': Zap,
  'settings': Settings,
  'cog': Cog,
  'wrench': Wrench,
  'tool': Tool,
  
  // Business & Finance Icons
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  'line-chart': LineChart,
  'calculator': Calculator,
  'credit-card': CreditCard,
  'banknote': Banknote,
  'coins': Coins,
  'receipt': Receipt,
  'target': Target,
  
  // Communication & Social Icons
  'message-square': MessageSquare,
  'message-circle': MessageCircle,
  'mail': Mail,
  'phone': Phone,
  'video': Video,
  'mic': Mic,
  'send': Send,
  'share': Share,
  'link': Link,
  'globe': Globe,
  'wifi': Wifi,
  
  // Navigation & Action Icons
  'search': Search,
  'filter': Filter,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'plus': Plus,
  'minus': Minus,
  'x': X,
  'check': Check,
  'square': Square,
  
  // Document & Content Icons
  'file-text': FileText,
  'file': File,
  'folder': Folder,
  'folder-open': FolderOpen,
  'download': Download,
  'upload': Upload,
  'save': Save,
  'edit': Edit,
  'copy': Copy,
  'clipboard': Clipboard,
  'book-open': BookOpen,
  'book': Book,
  
  // Time & Calendar Icons
  'clock': Clock,
  'calendar': Calendar,
  'calendar-days': CalendarDays,
  'timer': Timer,
  'hourglass': Hourglass,
  
  // Location & Geography Icons
  'map-pin': MapPin,
  'map': Map,
  'navigation': Navigation,
  'compass': Compass,
  
  // Status & Feedback Icons
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  'info': Info,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'help-circle': HelpCircle,
  'star': Star,
  'heart': Heart,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  
  // Security & Privacy Icons
  'lock': Lock,
  'unlock': Unlock,
  'key': Key,
  'shield-check': ShieldCheck,
  'eye': Eye,
  'eye-off': EyeOff,
  
  // Media & Entertainment Icons
  'play': Play,
  'pause': Pause,
  'stop': Stop,
  'volume-2': Volume2,
  'volume-x': VolumeX,
  'image': Image,
  'camera': Camera,
  
  // Shopping & Commerce Icons
  'shopping-cart': ShoppingCart,
  'package': Package,
  'truck': Truck,
  'store': Store,
  'briefcase': Briefcase,
  
  // Building & Organization Icons
  'building': Building,
  'building-2': Building2,
  'home': Home,
  'factory': Factory,
  
  // Research & Intelligence Icons
  'brain': Brain,
  'lightbulb': Lightbulb,
  'microscope': Microscope,
  'telescope': Telescope,
  'flask-conical': FlaskConical,
  'chart-bar': ChartBar,
  'activity': Activity,
  'layers': Layers,
  'git-branch': GitBranch,
  'workflow': Workflow,
  
  // Integration & Connectivity Icons
  'puzzle': Puzzle,
  'plug': Plug,
  'cable': Cable,
  'router': Router,
  'network': Network,
  
  // Growth & Expansion Icons
  'rocket': Rocket,
  'expand': Expand,
  
  // Competitive & Analysis Icons
  'crosshair': Crosshair,
  'radar': Radar,
  'binoculars': Binoculars,
  'scale': Scale,
};

// Default icon sizes for different use cases
export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
} as const;

export type IconSize = keyof typeof iconSizes;
export type IconName = keyof typeof iconMap;

// Props for the Icon component
export interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  [key: string]: any; // Allow additional props to be passed to the icon
}

// Reusable Icon component that renders icons by name
export function Icon({ name, size = 'sm', className = '', ...props }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap. Available icons:`, Object.keys(iconMap));
    // Return a fallback icon
    return <HelpCircle className={`${iconSizes[size]} ${className}`} {...props} />;
  }
  
  return <IconComponent className={`${iconSizes[size]} ${className}`} {...props} />;
}

// Utility function to check if an icon exists
export function hasIcon(name: string): name is IconName {
  return name in iconMap;
}

// Get all available icon names
export function getAvailableIcons(): IconName[] {
  return Object.keys(iconMap) as IconName[];
}

// Icon categories for better organization
export const iconCategories = {
  users: ['users', 'user', 'user-check', 'user-plus', 'user-x', 'contact', 'crown', 'shield'],
  technology: ['code', 'database', 'server', 'cloud', 'cpu', 'hard-drive', 'monitor', 'smartphone', 'tablet', 'laptop', 'zap', 'settings', 'cog', 'wrench', 'tool'],
  business: ['dollar-sign', 'trending-up', 'trending-down', 'bar-chart', 'pie-chart', 'line-chart', 'calculator', 'credit-card', 'banknote', 'coins', 'receipt', 'target'],
  communication: ['message-square', 'message-circle', 'mail', 'phone', 'video', 'mic', 'send', 'share', 'link', 'globe', 'wifi'],
  navigation: ['search', 'filter', 'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'chevron-right', 'chevron-left', 'chevron-up', 'chevron-down', 'plus', 'minus', 'x', 'check', 'square'],
  documents: ['file-text', 'file', 'folder', 'folder-open', 'download', 'upload', 'save', 'edit', 'copy', 'clipboard', 'book-open', 'book'],
  time: ['clock', 'calendar', 'calendar-days', 'timer', 'hourglass'],
  location: ['map-pin', 'map', 'navigation', 'compass'],
  status: ['alert-triangle', 'alert-circle', 'info', 'check-circle', 'x-circle', 'help-circle', 'star', 'heart', 'thumbs-up', 'thumbs-down'],
  security: ['lock', 'unlock', 'key', 'shield-check', 'eye', 'eye-off'],
  media: ['play', 'pause', 'stop', 'volume-2', 'volume-x', 'image', 'camera'],
  commerce: ['shopping-cart', 'package', 'truck', 'store'],
  building: ['building', 'building-2', 'home', 'factory'],
  research: ['brain', 'lightbulb', 'microscope', 'telescope', 'flask-conical', 'chart-bar', 'activity', 'layers', 'git-branch', 'workflow'],
  integration: ['puzzle', 'plug', 'cable', 'router', 'network'],
  growth: ['rocket', 'expand'],
  competitive: ['crosshair', 'radar', 'binoculars', 'scale'],
} as const;

// Get icons by category
export function getIconsByCategory(category: keyof typeof iconCategories): IconName[] {
  return [...iconCategories[category]] as IconName[];
}