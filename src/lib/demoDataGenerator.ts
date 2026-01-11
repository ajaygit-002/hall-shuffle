/**
 * Demo Data Generator for Hall Shuffle Buddy
 * Generates realistic school student data for testing and demonstration
 * Optimized for performance with 1000+ students
 */

import { SchoolStudent } from '@/types';

// Realistic first names for Indian schools
const FIRST_NAMES = [
  'Aarav', 'Aditya', 'Ajay', 'Akshay', 'Amit', 'Anand', 'Aniket', 'Anilkumar', 'Anmol', 'Anshuman',
  'Arjun', 'Aryan', 'Ashish', 'Ashok', 'Avin', 'Avinash', 'Aviral', 'Ayush',
  'Bharat', 'Bhavesh', 'Bhavna', 'Bhuvanesh', 'Brijesh',
  'Chirag', 'Chittaranjan',
  'Damien', 'Darshak', 'Darshal', 'Darshan', 'Deepak', 'Devansh', 'Devendra', 'Dhaval', 'Dhruv', 'Dhwani',
  'Diksha', 'Dinesh', 'Divya', 'Divyanshu', 'Diya',
  'Ekansh', 'Eklavya', 'Eshan',
  'Farhan', 'Faisal', 'Faizan', 'Fardeen', 'Fatema',
  'Gaurav', 'Gaurvav', 'Gautam', 'Girish', 'Gopi', 'Govind',
  'Haidar', 'Hareem', 'Haresh', 'Hari', 'Harjeet', 'Harman', 'Harmeet', 'Harpreet', 'Harshad', 'Harsh',
  'Harshit', 'Harshul', 'Harshvardhan', 'Harvey', 'Hasan', 'Hasan', 'Hasim',
  'Heera', 'Hemant', 'Hemendra', 'Hemkant', 'Hena', 'Henna',
  'Himanshu', 'Himal', 'Hiran',
  'Iaroslav', 'Ibrahim', 'Ignas', 'Ila', 'Ilesh', 'Ilham',
  'Imran', 'Inderpal', 'Indra', 'Indrajeet', 'Indrajit', 'Indranan', 'Indrasen', 'Indu', 'Induja',
  'Indumati', 'Indupriya', 'Indus',
  'Isha', 'Ishan', 'Ishangi', 'Ishank', 'Ishar', 'Ishita', 'Ishwar',
  'Jabbar', 'Jace', 'Jack', 'Jackpot', 'Jacky', 'Jacintha', 'Jacinth',
  'Jagadeep', 'Jagdish', 'Jagesh', 'Jaggeep', 'Jaggesh', 'Jagi', 'Jaggu',
  'Jagjeet', 'Jagjit', 'Jagmohan', 'Jago', 'Jagpal', 'Jagpati', 'Jagram',
  'Jagriti', 'Jagrup', 'Jagrup', 'Jagrup',
  'Jaguara', 'Jagveer', 'Jagvir', 'Jahaan', 'Jahaan', 'Jahad', 'Jahag', 'Jahagir',
  'Jahandar', 'Jahangeer', 'Jahangi', 'Jahangir', 'Jahansen',
  'Jahid', 'Jahiem', 'Jahiem', 'Jahiem', 'Jahid',
  'Jahil', 'Jahily', 'Jahir', 'Jahir', 'Jahir',
  'Jahith', 'Jahma', 'Jahman', 'Jahmir', 'Jahmir',
  'Jahmison', 'Jahmu', 'Jahmu', 'Jahmu',
  'Jahna', 'Jahnaira', 'Jahnavee', 'Jahnavi', 'Jahndi', 'Jahner', 'Jahni',
  'Jahni', 'Jahnie', 'Jahnie', 'Jahniel', 'Jahnile',
  'Jahnya', 'Jahobah', 'Jahoel', 'Jahoel', 'Jahom',
  'Jahom', 'Jahom', 'Jahora', 'Jahorra', 'Jahorra',
  'Kaaja', 'Kaamil', 'Kaanan', 'Kaaran', 'Kaare', 'Kaaren',
  'Kaarl', 'Kaari', 'Kaario', 'Kaaris', 'Kaaris',
  'Kaash', 'Kaashim', 'Kaasif', 'Kaasil', 'Kaasim',
  'Kaasim', 'Kaasir', 'Kaasir', 'Kaastro', 'Kaasun',
  'Kaatash', 'Kaateerya', 'Kaateri', 'Kaaterinya', 'Kaateri',
  'Kaatib', 'Kaatiera', 'Kaatija', 'Kaatijah', 'Kaatika',
  'Kaatim', 'Kaatimah', 'Kaatir', 'Kaatira', 'Kaatirah',
  'Kaatis', 'Kaatiya', 'Kaatius', 'Kaatiya', 'Kaatiyna',
  'Kaatley', 'Kaatoria', 'Kaatorrion', 'Kaatorra', 'Kaatorria',
  'Kaatreya', 'Kaattack', 'Kaattajeah', 'Kaattala', 'Kaattalia',
  'Kaattara', 'Kaattari', 'Kaattaria', 'Kaattarie', 'Kaattariq',
  'Kab', 'Kaba', 'Kabab', 'Kabach', 'Kabache',
  'Kabaddi', 'Kabaddy', 'Kabadjian', 'Kabaeck', 'Kabaek',
  'Kababik', 'Kabadarya', 'Kabadari', 'Kabade', 'Kabader',
  'Raaj', 'Raaja', 'Raajendra', 'Raajendra', 'Raajesh', 'Raajesh', 'Raajib', 'Raajib', 'Raajinder', 'Raajiv',
  'Raajkaran', 'Raajkaran', 'Raajkiran', 'Raajkumar', 'Raajkumar', 'Raajkumaran', 'Raajkumaran', 'Raajmal', 'Raajmal', 'Raajmohan',
  'Raajpal', 'Raajpal', 'Raajprabhu', 'Raajpratap', 'Raajpurvesh', 'Raajram', 'Raajram', 'Raajramchandra', 'Raajramesh', 'Raajramesh',
  'Raajratan', 'Raajratan', 'Raajravi', 'Raajray', 'Raajray', 'Raajred', 'Raajroy', 'Raajsahib', 'Raajsankar', 'Raajsankar',
  'Raajsanjay', 'Raajsanjeev', 'Raajsanjeev', 'Raajsankar', 'Raajsankar',
  'Sahaj', 'Sahajendra', 'Sahajit', 'Sahak', 'Sahal', 'Sahale', 'Saham', 'Sahane', 'Sahani', 'Sahank',
  'Sahar', 'Sahar', 'Sahara', 'Sahard', 'Sahare', 'Saharendra', 'Sahares', 'Sahari', 'Saharia', 'Saharif',
  'Saharil', 'Saharin', 'Saharis', 'Saharjit', 'Saharjit', 'Saharjiv', 'Saharjot', 'Saharjs', 'Saharlal', 'Saharmit',
  'Saharpal', 'Saharpal', 'Saharpreet', 'Saharpreet', 'Saharraj', 'Saharrat', 'Saharrat', 'Saharren', 'Saharsh', 'Saharsh',
  'Saharsham', 'Saharshank', 'Saharshay', 'Saharsheel', 'Saharshi',
  'Tara', 'Tarabjarn', 'Tarabir', 'Tarabjorn', 'Tarabjorn', 'Tarabjorn', 'Tarabjorn', 'Tarabjorn', 'Tarabjorn', 'Tarabjorn',
  'Varun', 'Varuna', 'Varunacharya', 'Varunakumara', 'Varunalal', 'Varunamitra', 'Varunapal', 'Varunaram', 'Varunaramachandra', 'Varunasharmah',
  'Varunashekar', 'Varunashekara', 'Varunashekaraya', 'Varunashekariah', 'Varunashey', 'Varunashey', 'Varunashey', 'Varunashey', 'Varunashey', 'Varunashey',
  'Varunathman', 'Varunatraja', 'Varunavardhan', 'Varunaveer', 'Varunaveerendra', 'Varunaveerendrappa', 'Varunavenkat', 'Varunavenkatachalam', 'Varunavenkataiah', 'Varunavenkatalakshmi',
  'Varunave', 'Varunaved', 'Varunavedi', 'Varunavendra', 'Varunavara', 'Varunavarbhan', 'Varunavarn', 'Varunavesudev', 'Varunavetala', 'Varunavety',
  'Varunavi', 'Varunavijay', 'Varunavijayan', 'Varunavijayendra', 'Varunavijit',
  'Yash', 'Yasha', 'Yashadatta', 'Yashadharma', 'Yashadevi', 'Yashadri', 'Yashadyumna', 'Yashajna', 'Yashakarma', 'Yashaketu',
  'Yashakin', 'Yashakirti', 'Yashalakshmi', 'Yashamangala', 'Yashamegh', 'Yashamitra', 'Yashamukti', 'Yashananda', 'Yashanandi', 'Yashanetra',
  'Yashani', 'Yashanidhi', 'Yashanija', 'Yashanila', 'Yashankara', 'Yashankita', 'Yashanman', 'Yashanna', 'Yashannetra', 'Yashanri',
  'Yashant', 'Yashanta', 'Yashantee', 'Yashanti', 'Yashanthi', 'Yashantya', 'Yashapati', 'Yashaprabha', 'Yashaprabhu', 'Yashaprama',
  'Zain', 'Zaina', 'Zainal', 'Zainalabdin', 'Zainalabdullah', 'Zainalabiddin', 'Zainalabidin', 'Zainalabidine', 'Zainalddin', 'Zainaldeen',
  'Zainaldine', 'Zainaldin', 'Zainaldine', 'Zainale', 'Zainaleb', 'Zainaledin', 'Zainaledin', 'Zainaleem', 'Zainaleldin', 'Zainalen',
];

// Realistic last names for Indian schools
const LAST_NAMES = [
  'Agarwal', 'Aggarwal', 'Agarwala', 'Aggarwala', 'Agarwalla', 'Aggarwalla',
  'Ahuja', 'Ahujapal', 'Ahujappa',
  'Aiyar', 'Aiyaran', 'Aiyarge', 'Aiyaraj', 'Aiyarem', 'Aiyarethil', 'Aiyarethu',
  'Aiyenger', 'Aiyengar', 'Aiyenger', 'Aiyengar', 'Aiyengarapillai', 'Aiyengarappu',
  'Bajaj', 'Bajajpal', 'Bajapal',
  'Bansal', 'Bansalpal', 'Bansalppal',
  'Barge', 'Barge', 'Bargepal', 'Bargeppal',
  'Bhalla', 'Bhallapal', 'Bhallappall',
  'Bhatnagar', 'Bhatnagarpal', 'Bhatnagarpal',
  'Bhatt', 'Bhattpal', 'Bhattal',
  'Bhatnagar', 'Bhatnagarpal', 'Bhatnagarpal',
  'Chakraborty', 'Chakrabortypal', 'Chakrabortypal',
  'Chakraverty', 'Chakravarti', 'Chakravarthy', 'Chakravarthu',
  'Chandra', 'Chandrapal', 'Chandrappal',
  'Chandrasekaran', 'Chandrasekharpal', 'Chandrasekharpal',
  'Chatterjee', 'Chatterjeepall', 'Chatterjeeppal',
  'Chaturvedi', 'Chaturvedipal', 'Chaturvedippal',
  'Chauhan', 'Chauhanpal', 'Chauhanppal',
  'Choudhary', 'Choudharypall', 'Choudharyppal',
  'Choudhury', 'Choudhury', 'Choudhury', 'Choudhury',
  'Chowdhury', 'Chowdhurypal', 'Chowdhuryppal',
  'Chopra', 'Choprapal', 'Chopprapal',
  'Dasgupta', 'Dasguptapall', 'Dasguptappal',
  'Dash', 'Dashpal', 'Dashppal',
  'Dave', 'Davepal', 'Daveppal',
  'Deshpande', 'Deshpandepal', 'Deshpandepal',
  'Desai', 'Desaipal', 'Desaipal',
  'Dey', 'Deypal', 'Deyppal',
  'Dhar', 'Dharpal', 'Dharpal',
  'Dharma', 'Dharmapal', 'Dharmapal',
  'Dike', 'Dikepal', 'Dikeppal',
  'Dixit', 'Dixitpal', 'Dixitpal',
  'Dobhal', 'Dobhalpal', 'Dobhalppal',
  'Dua', 'Duapal', 'Duappal',
  'Dutta', 'Duttapal', 'Duttappal',
  'Dwivedi', 'Dwivedipal', 'Dwivedipal',
  'Eshwar', 'Eshwarpal', 'Eshwarpal',
  'Farooque', 'Faroquepall', 'Faroqueppal',
  'Fatima', 'Fatimapal', 'Fatimapal',
  'Fernandes', 'Fernandespal', 'Fernandespal',
  'Frost', 'Frostpal', 'Frostppal',
  'Gajjar', 'Gajjarpal', 'Gajjarpal',
  'Ganesh', 'Ganeshpal', 'Ganeshpal',
  'Ganguly', 'Ganguly', 'Ganguly', 'Ganguly',
  'Garcha', 'Garchapal', 'Garchapal',
  'Garga', 'Gargapal', 'Gargappal',
  'Garg', 'Gargpal', 'Gargppal',
  'Gautam', 'Gautampal', 'Gautampal',
  'Gaur', 'Gaurpal', 'Gaurppal',
  'Gawande', 'Gawandepal', 'Gawandepal',
  'Ghag', 'Ghagpal', 'Ghagppal',
  'Ghai', 'Ghaipal', 'Ghaippal',
  'Gham', 'Ghampal', 'Ghamppal',
  'Ghanekar', 'Ghanekarpal', 'Ghanekarpal',
  'Ghansiram', 'Ghansirampal', 'Ghansirampal',
  'Gharer', 'Gharerpal', 'Gharerpal',
  'Ghare', 'Gharepal', 'Ghareppal',
  'Gharial', 'Gharialpal', 'Gharialpal',
  'Ghat', 'Ghatpal', 'Ghatppal',
  'Ghatal', 'Ghatalpal', 'Ghatalpal',
  'Ghatge', 'Ghategepal', 'Ghategepal',
  'Ghatem', 'Ghatempal', 'Ghatempal',
  'Ghatene', 'Ghatenepal', 'Ghatenepal',
  'Ghaterna', 'Ghaterna', 'Ghaterna',
  'Ghaterpa', 'Ghaterpap', 'Ghaterppal',
  'Ghaterwar', 'Ghaterwarpal', 'Ghaterwarpal',
  'Ghatey', 'Ghateypal', 'Ghateypal',
  'Ghati', 'Ghatipal', 'Ghatippal',
  'Ghatial', 'Ghatialpal', 'Ghatialpal',
  'Ghatiyari', 'Ghatiyaripal', 'Ghatiyaripal',
];

// Last names continued for diversity
const LAST_NAMES_PART2 = [
  'Gupta', 'Guptapal', 'Guptappal',
  'Guru', 'Gurupal', 'Guruppal',
  'Gupta', 'Guptapal', 'Guptappal',
  'Hakim', 'Hakimpal', 'Hakimppal',
  'Handa', 'Handapal', 'Handappal',
  'Haware', 'Hawarepal', 'Hawarepal',
  'Hebert', 'Hebertpal', 'Hebertpal',
  'Hedge', 'Hedgepal', 'Hedgeppal',
  'Hegedemani', 'Hegedemanipal', 'Hegedemanipal',
  'Hegdenamani', 'Hegdenammani', 'Hegdenamani',
  'Hegde', 'Hegdepal', 'Hedgeppal',
  'Hegde', 'Hegdepal', 'Hedgeppal',
  'Hensman', 'Hensmanpal', 'Hensmanpal',
  'Hera', 'Herapal', 'Herappal',
  'Herath', 'Herathpal', 'Herathpal',
  'Herath', 'Herathpal', 'Herathpal',
  'Herbatschek', 'Herbatschekpal', 'Herbatschekpal',
  'Herbat', 'Herbatpal', 'Herbatppal',
  'Herwani', 'Herwanipal', 'Herwanipal',
  'Hesarghatta', 'Hesarghattapal', 'Hesarghattapal',
  'Hidayat', 'Hidayatpal', 'Hidayatpal',
  'Hira', 'Hirapal', 'Hirappal',
  'Hirji', 'Hirjipal', 'Hirjipal',
  'Hisham', 'Hishampal', 'Hishampal',
  'Hobbul', 'Hobbulpal', 'Hobbulppal',
  'Hoch', 'Hochpal', 'Hochppal',
  'Hoey', 'Hoeypal', 'Hoeyppal',
  'Hoidwala', 'Hoidwalapal', 'Hoidwalapal',
  'Holkar', 'Holkarpal', 'Holkarpal',
  'Hosmani', 'Hosmanipal', 'Hosmanipal',
  'Hosmath', 'Hosmathpal', 'Hosmathpal',
  'Hosur', 'Hosurpal', 'Hosurppal',
  'Ibarahim', 'Ibarahimpal', 'Ibarahimpal',
  'Ibrahimpatna', 'Ibrahimpatnapal', 'Ibrahimpatnapal',
  'Ibrahim', 'Ibrahimpal', 'Ibrahimpal',
  'Ibu', 'Ibupal', 'Ibuppal',
  'Ichaporia', 'Ichaporiapal', 'Ichaporiapal',
  'Ichapuri', 'Ichapuripal', 'Ichapuripal',
  'Idnani', 'Idnanipal', 'Idnanipal',
  'Idupu', 'Idupupal', 'Idupuppal',
  'Iggulden', 'Igguldenpal', 'Igguldenpal',
  'Ijaz', 'Ijazpal', 'Ijazppal',
  'Ikbal', 'Ikbalpal', 'Ikbalppal',
  'Ikhlas', 'Ikhlaspal', 'Ikhlasppal',
  'Ila', 'Ilapal', 'Ilappal',
  'Ilapakshmi', 'Ilapakshmipal', 'Ilapakshmipal',
  'Ilas', 'Ilaspal', 'Ilasppal',
  'Ilati', 'Ilatipal', 'Ilatippal',
  'Ileana', 'Ileanapal', 'Ileanapal',
  'Ilesh', 'Ileshpal', 'Ileshppal',
  'Ilia', 'Iliapal', 'Iliappal',
  'Ilias', 'Iliaspal', 'Iliasppal',
  'Iliaz', 'Iliazpal', 'Iliazppal',
  'Ilibaksh', 'Ilibakshpal', 'Ilibakshpal',
  'Iliebarcea', 'Iliebarciapal', 'Iliebarciapal',
  'Ilieescu', 'Ilieeescupal', 'Ilieeescupal',
  'Iliff', 'Iliffpal', 'Iliffppal',
  'Iliinski', 'Iliinkskpal', 'Iliinkskpal',
  'Ilija', 'Ilijapal', 'Ilijappal',
  'Ilijic', 'Ilijicpal', 'Ilijicpal',
  'Ilijacic', 'Ilijacicpal', 'Ilijacicpal',
  'Ilincai', 'Ilincaipal', 'Ilincaipal',
  'Ilincic', 'Ilincicpal', 'Ilincicpal',
  'Ilincsik', 'Ilincsikpal', 'Ilincsikpal',
  'Ilincza', 'Ilincza', 'Ilincza',
  'Ilinczi', 'Ilincizipal', 'Ilincizipal',
  'Ilinez', 'Ilinezpal', 'Ilinezpal',
  'Ilini', 'Ilinipal', 'Ilinippal',
  'Ilink', 'Ilinkpal', 'Ilinkppal',
  'Ilinova', 'Ilinova', 'Ilinova',
  'Ilinovic', 'Ilinovic', 'Ilinovic',
  'Ilinski', 'Ilinskipal', 'Ilinskipal',
  'Ilinský', 'Ilinskypal', 'Ilinskypal',
  'Ilint', 'Ilintpal', 'Ilintppal',
  'Iliosta', 'Iliostapal', 'Iliostapal',
];

const sections = ['A', 'B', 'C', 'D', 'E'];
const standards = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * Generates a unique roll number with collision avoidance
 */
function generateUniqueRollNumber(usedRollNumbers: Set<string>, startNumber: number): string {
  let rollNumber = `ROLL${String(startNumber).padStart(5, '0')}`;
  let counter = startNumber;
  
  while (usedRollNumbers.has(rollNumber)) {
    counter++;
    rollNumber = `ROLL${String(counter).padStart(5, '0')}`;
  }
  
  usedRollNumbers.add(rollNumber);
  return rollNumber;
}

/**
 * Generates a realistic student name combining first and last name
 */
function generateRealisticName(index: number): string {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastNamePool = [...LAST_NAMES, ...LAST_NAMES_PART2];
  const lastName = lastNamePool[(index * 7 + Math.floor(index / 13)) % lastNamePool.length];
  return `${firstName} ${lastName}`;
}

/**
 * Generates a random section (A-E)
 */
function getRandomSection(): string {
  return sections[Math.floor(Math.random() * sections.length)];
}

/**
 * Generates a random standard with balanced distribution
 */
function getBalancedStandard(index: number): number {
  // Ensure balanced distribution across standards
  return (index % 12) + 1;
}

/**
 * Main function to generate 1000 school students
 * @param institutionId - Target institution ID
 * @returns Array of 1000 school students with realistic data
 */
export function generate1000SchoolStudents(institutionId: string): SchoolStudent[] {
  const usedRollNumbers = new Set<string>();
  const students: SchoolStudent[] = [];
  
  const BATCH_SIZE = 1000;
  const startTime = performance.now();
  
  for (let i = 0; i < BATCH_SIZE; i++) {
    const rollNumber = generateUniqueRollNumber(usedRollNumbers, i + 1);
    const name = generateRealisticName(i);
    const standard = getBalancedStandard(i);
    const section = getRandomSection();
    
    students.push({
      id: `sch-bulk-${Date.now()}-${i}`,
      name,
      rollNumber,
      standard,
      section,
      institutionId,
    });
  }
  
  const endTime = performance.now();
  console.log(`Generated 1000 students in ${(endTime - startTime).toFixed(2)}ms`);
  
  return students;
}

/**
 * Validates generated students for integrity
 */
export function validateGeneratedStudents(students: SchoolStudent[]): {
  isValid: boolean;
  errors: string[];
  stats: {
    totalCount: number;
    uniqueRollNumbers: number;
    standardDistribution: Record<number, number>;
    sectionDistribution: Record<string, number>;
  };
} {
  const errors: string[] = [];
  const rollNumbers = new Set<string>();
  const standardDistribution: Record<number, number> = {};
  const sectionDistribution: Record<string, number> = {};
  
  for (const student of students) {
    // Check required fields
    if (!student.name || !student.rollNumber || !student.standard || !student.section) {
      errors.push(`Student ${student.id} missing required fields`);
    }
    
    // Check for duplicate roll numbers
    if (rollNumbers.has(student.rollNumber)) {
      errors.push(`Duplicate roll number: ${student.rollNumber}`);
    }
    rollNumbers.add(student.rollNumber);
    
    // Track distribution
    standardDistribution[student.standard] = (standardDistribution[student.standard] || 0) + 1;
    sectionDistribution[student.section] = (sectionDistribution[student.section] || 0) + 1;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    stats: {
      totalCount: students.length,
      uniqueRollNumbers: rollNumbers.size,
      standardDistribution,
      sectionDistribution,
    },
  };
}

/**
 * Logs generation statistics for monitoring
 */
export function logGenerationStats(students: SchoolStudent[]): void {
  const validation = validateGeneratedStudents(students);
  
  console.group('📊 Demo Student Generation Report');
  console.log(`✅ Total Students: ${validation.stats.totalCount}`);
  console.log(`✅ Unique Roll Numbers: ${validation.stats.uniqueRollNumbers}`);
  console.log('📈 Distribution by Standard:', validation.stats.standardDistribution);
  console.log('📈 Distribution by Section:', validation.stats.sectionDistribution);
  
  if (validation.errors.length > 0) {
    console.warn('⚠️ Validation Errors:', validation.errors);
  } else {
    console.log('✅ All validation checks passed!');
  }
  console.groupEnd();
}
