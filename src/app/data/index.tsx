import {
  faCommentDots,
  faEye,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

export const navs = [
  { name: "Dashboard", icon: "fas fa-home" },
  { name: "Employees", icon: "fas fa-users" },
  { name: "Departments", icon: "fas fa-building" },
  { name: "Attendance", icon: "fas fa-calendar-check" },
  // { name: "Performance", icon: "fas fa-chart-line" },
  { name: "Goals", icon: "fas fa-bullseye" },
  // { name: "Training", icon: "fas fa-chalkboard-teacher" },
  { name: "Rewards", icon: "fas fa-gift" },
  { name: "Surveys", icon: "fas fa-poll" },
  { name: "Settings", icon: "fas fa-cog" },
  // { name: "Logout", icon: "fas fa-door-open" },
];
export const employees = [
  {
    name: "Oluwaseun Adewale",
    id: "202309",
    department: "Contact Center",
    designation: "Email",
    manager: "Adeola Owolade",
    status: "Active",
  },
  {
    name: "Chidera Okoyes",
    id: "202310",
    department: "Contact Center",
    designation: "QA",
    manager: "Adeola Owolade",
    status: "Active",
  },
  {
    name: "Kunle Olaniyan",
    id: "202311",
    department: "Contact Center",
    designation: "Inbound & Video",
    manager: "Adeola Owolade",
    status: "Active",
  },
  {
    name: "Kemi Olorunshola",
    id: "202201",
    department: "Contact Center",
    designation: "Outbound",
    manager: "Adeola Owolade",
    status: "Active",
  },
  {
    name: "Adeola Owolade",
    id: "202202",
    department: "Contact Center",
    designation: "Chats",
    manager: "Oluwafemi Olowo",
    status: "Active",
  },
  {
    name: "Chibuzor Okonkwo",
    id: "202401",
    department: "Contact Center",
    designation: "Email",
    manager: "Oluwafemi Olowo",
    status: "Active",
  },
  {
    name: "Uche Nwafor",
    id: "202289",
    department: "Contact Center",
    designation: "Resolution",
    manager: "Nonso Okafor",
    status: "Active",
  },
  {
    name: "Olamide Adebayo",
    id: "202290",
    department: "Contact Center",
    designation: "Resolution",
    manager: "Kemi Olorunshola",
    status: "Active",
  },
  {
    name: "Ngozi Opara",
    id: "202291",
    department: "Contact Center",
    designation: "Chats",
    manager: "Kemi Olorunshola",
    status: "Active",
  },
  {
    name: "Taiwo Oyewole",
    id: "202315",
    department: "Contact Center",
    designation: "QA",
    manager: "Kemi Olorunshola",
    status: "Active",
  },
  {
    name: "Adekunle Oduwole",
    id: "202345",
    department: "Contact Center",
    designation: "Inbound",
    manager: "Chidera Okoyes",
    status: "Active",
  },
  {
    name: "Chika Iwu",
    id: "202214",
    department: "Contact Center",
    designation: "Outbound",
    manager: "Chidera Okoyes",
    status: "Active",
  },
];

export const employees2 = [
  {
    name: "Leasie Watson",
    designation: "Team Lead - Design",
    type: "Office",
    checkIn: "09:27 AM",
    status: "Present",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Darlene Robertson",
    designation: "Web Designer",
    type: "Office",
    checkIn: "10:15 AM",
    status: "Absent",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Jacob Jones",
    designation: "Medical Assistant",
    type: "Remote",
    checkIn: "10:24 AM",
    status: "Absent",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Kathryn Murphy",
    designation: "Marketing Coordinator",
    type: "Office",
    checkIn: "09:10 AM",
    status: "Present",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Leslie Alexander",
    designation: "Data Analyst",
    type: "Office",
    checkIn: "09:15 AM",
    status: "Present",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Ronald Richards",
    designation: "Python Developer",
    type: "Remote",
    checkIn: "09:29 AM",
    status: "Present",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Guy Hawkins",
    designation: "UI/UX Design",
    type: "Remote",
    checkIn: "09:29 AM",
    status: "Present",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Albert Flores",
    designation: "React JS",
    type: "Remote",
    checkIn: "09:29 AM",
    status: "Present",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Savannah Nguyen",
    designation: "IOS Developer",
    type: "Remote",
    checkIn: "10:50 AM",
    status: "Absent",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Marvin McKinney",
    designation: "HR",
    type: "Remote",
    checkIn: "09:29 AM",
    status: "Present",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Jerome Bell",
    designation: "Sales Manager",
    type: "Remote",
    checkIn: "09:29 AM",
    status: "Present",
    img: "https://placehold.co/50x50",
  },
  {
    name: "Jenny Wilson",
    designation: "React JS Developer",
    type: "Remote",
    checkIn: "11:30 AM",
    status: "Absent",
    img: "https://placehold.co/50x50",
  },
];

export const nationalities = [
  { id: 1, name: "Afghan" },
  { id: 2, name: "Albanian" },
  { id: 3, name: "Algerian" },
  { id: 4, name: "American" },
  { id: 5, name: "Andorran" },
  { id: 6, name: "Angolan" },
  { id: 7, name: "Antiguan" },
  { id: 8, name: "Argentine" },
  { id: 9, name: "Armenian" },
  { id: 10, name: "Australian" },
  { id: 11, name: "Austrian" },
  { id: 12, name: "Azerbaijani" },
  { id: 13, name: "Bahamian" },
  { id: 14, name: "Bahraini" },
  { id: 15, name: "Bangladeshi" },
  { id: 16, name: "Barbadian" },
  { id: 17, name: "Belarusian" },
  { id: 18, name: "Belgian" },
  { id: 19, name: "Belizean" },
  { id: 20, name: "Beninese" },
  { id: 21, name: "Bhutanese" },
  { id: 22, name: "Bolivian" },
  { id: 23, name: "Bosnian" },
  { id: 24, name: "Botswanan" },
  { id: 25, name: "Brazilian" },
  { id: 26, name: "British" },
  { id: 27, name: "Bruneian" },
  { id: 28, name: "Bulgarian" },
  { id: 29, name: "Burkinabe" },
  { id: 30, name: "Burmese" },
  { id: 31, name: "Burundian" },
  { id: 32, name: "Cabo Verdean" },
  { id: 33, name: "Cambodian" },
  { id: 34, name: "Cameroonian" },
  { id: 35, name: "Canadian" },
  { id: 36, name: "Central African" },
  { id: 37, name: "Chadian" },
  { id: 38, name: "Chilean" },
  { id: 39, name: "Chinese" },
  { id: 40, name: "Colombian" },
  { id: 41, name: "Comorian" },
  { id: 42, name: "Congolese" },
  { id: 43, name: "Costa Rican" },
  { id: 44, name: "Croatian" },
  { id: 45, name: "Cuban" },
  { id: 46, name: "Cypriot" },
  { id: 47, name: "Czech" },
  { id: 48, name: "Danish" },
  { id: 49, name: "Djiboutian" },
  { id: 50, name: "Dominican" },
  { id: 51, name: "Dutch" },
  { id: 52, name: "East Timorese" },
  { id: 53, name: "Ecuadorean" },
  { id: 54, name: "Egyptian" },
  { id: 55, name: "Emirati" },
  { id: 56, name: "Equatorial Guinean" },
  { id: 57, name: "Eritrean" },
  { id: 58, name: "Estonian" },
  { id: 59, name: "Eswatini" },
  { id: 60, name: "Ethiopian" },
  { id: 61, name: "Fijian" },
  { id: 62, name: "Finnish" },
  { id: 63, name: "French" },
  { id: 64, name: "Gabonese" },
  { id: 65, name: "Gambian" },
  { id: 66, name: "Georgian" },
  { id: 67, name: "German" },
  { id: 68, name: "Ghanaian" },
  { id: 69, name: "Greek" },
  { id: 70, name: "Grenadian" },
  { id: 71, name: "Guatemalan" },
  { id: 72, name: "Guinean" },
  { id: 73, name: "Guinea-Bissauan" },
  { id: 74, name: "Guyanese" },
  { id: 75, name: "Haitian" },
  { id: 76, name: "Honduran" },
  { id: 77, name: "Hungarian" },
  { id: 78, name: "Icelandic" },
  { id: 79, name: "Indian" },
  { id: 80, name: "Indonesian" },
  { id: 81, name: "Iranian" },
  { id: 82, name: "Iraqi" },
  { id: 83, name: "Irish" },
  { id: 84, name: "Israeli" },
  { id: 85, name: "Italian" },
  { id: 86, name: "Ivorian" },
  { id: 87, name: "Jamaican" },
  { id: 88, name: "Japanese" },
  { id: 89, name: "Jordanian" },
  { id: 90, name: "Kazakh" },
  { id: 91, name: "Kenyan" },
  { id: 92, name: "Kiribati" },
  { id: 93, name: "Kuwaiti" },
  { id: 94, name: "Kyrgyz" },
  { id: 95, name: "Lao" },
  { id: 96, name: "Latvian" },
  { id: 97, name: "Lebanese" },
  { id: 98, name: "Lesotho" },
  { id: 99, name: "Liberian" },
  { id: 100, name: "Libyan" },
  { id: 101, name: "Liechtenstein" },
  { id: 102, name: "Lithuanian" },
  { id: 103, name: "Luxembourgish" },
  { id: 104, name: "Macedonian" },
  { id: 105, name: "Malagasy" },
  { id: 106, name: "Malawian" },
  { id: 107, name: "Malaysian" },
  { id: 108, name: "Maldivian" },
  { id: 109, name: "Malian" },
  { id: 110, name: "Maltese" },
  { id: 111, name: "Marshallese" },
  { id: 112, name: "Mauritanian" },
  { id: 113, name: "Mauritian" },
  { id: 114, name: "Mexican" },
  { id: 115, name: "Micronesian" },
  { id: 116, name: "Moldovan" },
  { id: 117, name: "Monacan" },
  { id: 118, name: "Mongolian" },
  { id: 119, name: "Montenegrin" },
  { id: 120, name: "Moroccan" },
  { id: 121, name: "Mozambican" },
  { id: 122, name: "Namibian" },
  { id: 123, name: "Nauruan" },
  { id: 124, name: "Nepalese" },
  { id: 125, name: "New Zealand" },
  { id: 126, name: "Nicaraguan" },
  { id: 127, name: "Nigerien" },
  { id: 128, name: "Nigerian" },
  { id: 129, name: "North Korean" },
  { id: 130, name: "Norwegian" },
  { id: 131, name: "Omani" },
  { id: 132, name: "Pakistani" },
  { id: 133, name: "Palauan" },
  { id: 134, name: "Panamanian" },
  { id: 135, name: "Papua New Guinean" },
  { id: 136, name: "Paraguayan" },
  { id: 137, name: "Peruvian" },
  { id: 138, name: "Philippine" },
  { id: 139, name: "Polish" },
  { id: 140, name: "Portuguese" },
  { id: 141, name: "Qatari" },
  { id: 142, name: "Romanian" },
  { id: 143, name: "Russian" },
  { id: 144, name: "Rwandan" },
  { id: 145, name: "Saint Kitts and Nevis" },
  { id: 146, name: "Saint Lucian" },
  { id: 147, name: "Salvadoran" },
  { id: 148, name: "Samoan" },
  { id: 149, name: "San Marinese" },
  { id: 150, name: "Sao Tomean" },
  { id: 151, name: "Saudi Arabian" },
  { id: 152, name: "Scottish" },
  { id: 153, name: "Senegalese" },
  { id: 154, name: "Serbian" },
  { id: 155, name: "Seychellois" },
  { id: 156, name: "Sierra Leonean" },
  { id: 157, name: "Singaporean" },
  { id: 158, name: "Slovak" },
  { id: 159, name: "Slovenian" },
  { id: 160, name: "Solomon Islander" },
  { id: 161, name: "Somali" },
  { id: 162, name: "South African" },
  { id: 163, name: "South Korean" },
  { id: 164, name: "Spanish" },
  { id: 165, name: "Sri Lankan" },
  { id: 166, name: "Sudanese" },
  { id: 167, name: "Surinamese" },
  { id: 168, name: "Swazi" },
  { id: 169, name: "Swedish" },
  { id: 170, name: "Swiss" },
  { id: 171, name: "Syrian" },
  { id: 172, name: "Taiwanese" },
  { id: 173, name: "Tajik" },
  { id: 174, name: "Tanzanian" },
  { id: 175, name: "Thai" },
  { id: 176, name: "Togolese" },
  { id: 177, name: "Tongan" },
  { id: 178, name: "Trinidadian or Tobagonian" },
  { id: 179, name: "Tunisian" },
  { id: 180, name: "Turkish" },
  { id: 181, name: "Turkmen" },
  { id: 182, name: "Tuvaluan" },
  { id: 183, name: "Ugandan" },
  { id: 184, name: "Ukrainian" },
  { id: 185, name: "Uruguayan" },
  { id: 186, name: "Uzbek" },
  { id: 187, name: "Vanuatuan" },
  { id: 188, name: "Vatican" },
  { id: 189, name: "Venezuelan" },
  { id: 190, name: "Vietnamese" },
  { id: 191, name: "Yemeni" },
  { id: 192, name: "Zambian" },
  { id: 193, name: "Zimbabwean" },
];

export const surveys = [
  {
    id: "#212400-015",
    title: "Culture Transformation",
    time: "Created at 11:00am",
    views: "2,150",
    responses: "11,450",
  },
  {
    id: "#212400-015",
    title: "Culture Transformation",
    time: "Created at 11:00am",
    views: "2,150",
    responses: "11,450",
  },
  {
    id: "#212400-015",
    title: "Culture Transformation",
    time: "Created at 11:00am",
    views: "2,150",
    responses: "11,450",
  },
  {
    id: "#212400-015",
    title: "Culture Transformation",
    time: "Created at 11:00am",
    views: "2,150",
    responses: "11,450",
  },
  {
    id: "#212400-015",
    title: "Culture Transformation",
    time: "Created at 11:00am",
    views: "2,150",
    responses: "11,450",
  },
];

export const responses = [
  {
    name: "Oluwaseun Adewale",
    time: "1 minute ago",
    survey: "Culture Transformation",
  },
  {
    name: "Yemisi Akinfesola",
    time: "1 minute ago",
    survey: "Team Feedback",
  },
  { name: "Yvette Wilcox", time: "1 minute ago", survey: "Help Us Innovate" },
  {
    name: "Boluwatife Adesokan",
    time: "1 minute ago",
    survey: "Feature Review",
  },
  {
    name: "Oreoluwa Oforun",
    time: "1 minute ago",
    survey: "Culture Transformation",
  },
];

export const statsData = [
  {
    id: 1,
    icon: faFileAlt,
    title: "Surveys created",
    stat: "4.5%",
    trend: "up",
    value: "1,780",
    trendText: "vs last month",
    color: "text-green-500",
  },
  {
    id: 2,
    icon: faCommentDots,
    title: "Survey responses",
    stat: "1.2%",
    trend: "down",
    value: "200",
    trendText: "vs last month",
    color: "text-red-500",
  },
  {
    id: 3,
    icon: faEye,
    title: "Question views",
    stat: "1.2%",
    trend: "down",
    value: "15,645",
    trendText: "vs last month",
    color: "text-red-500",
  },
];
export const data = [
  {
    name: "April",
    Tech: 100.0,
    Sales: 24.49,
    percentage: 96.0,
  },
  {
    name: "May",
    Tech: 75.0,
    Sales: 14.26,
    percentage: 88.4,
  },
  {
    name: "June",
    Tech: 50.0,
    Sales: 100.0,
    percentage: 91.6,
  },
  {
    name: "July",
    Tech: 69.5,
    Sales: 39.87,
    percentage: 80.0,
  },
  {
    name: "August",
    Tech: 47.25,
    Sales: 48.98,
    percentage: 87.24,
  },
  {
    name: "September",
    Tech: 59.75,
    Sales: 38.78,
    percentage: 100.0,
  },
  {
    name: "October",
    Tech: 87.25,
    Sales: 43.88,
    percentage: 84.0,
  },
];
