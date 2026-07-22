export const navLinks = [
  { label: "FEATURES", href: "/#features" },
  { label: "TESTIMONIALS", href: "/#testimonials" },
  { label: "OUR TEAM", href: "/#employees" },
  { label: "VIDEOS", href: "/#demos" },
  { label: "ABOUT US", href: "/#aboutus" },
] as const;

export const features = [
  {
    title: "CLOUD BASED QUOTING",
    image: "/images/features/cloud.png",
    description:
      "Fast and accurate web-based ERP and quoting software built for window and door manufacturers. Our mobile-responsive design works seamlessly on phones and tablets, complete with digital signatures, giving sales reps everything they need to quote and sell projects right at the customer's home, delivering a professional, ready-to-sign proposal in a single visit.",
  },
  {
    title: "CNC INTEGRATION",
    image: "/images/features/cnc.png",
    description:
      "Automatically generate and transmit order data directly to CNC machining centers and saws through our API, eliminating the need to manually create and transfer production files via USB. WDQ also produces optimized linear cut and binning lists to maximize material yield. We've integrated with leading manufacturers including TigerStop, RazorGage, GED, Perfect Score, Yilmaz, Ino, Bottero, Greller, Urban, Sturtz, and many more.",
  },
  {
    title: "INVENTORY MANAGEMENT",
    image: "/images/features/inventory.png",
    description:
      "Accurately manage your company's inventory with an automated bill of materials that generates precise job costing and automatically allocates and deducts inventory based on each job's specific usage, so stock levels always reflect what's actually going out the door.",
  },
  {
    title: "PRODUCTION SCHEDULING",
    image: "/images/features/production.png",
    description:
      "Our production scheduling engine is built on the Theory of Constraints, automatically calculating an accurate ship date for every order based on current production volume, order size and complexity, and order priority. Rather than relying on static lead times, WDQ dynamically adjusts scheduling in real time as your shop floor conditions change, keeping ship dates realistic and your bottleneck resources fully utilized.",
  },
  {
    title: "BARCODE TRACKING",
    image: "/images/features/barcode.png",
    description:
      "Track the status of orders as they move through your production process in real time. Barcode scanning updates the percent completion of each order at every stage, giving both your production team and your customers full visibility into where a job stands from start to finish.",
  },
  {
    title: "STOREFRONT WINDOWS",
    image: "/images/features/storefront.png",
    description:
      "Our storefront programming enables your commercial quoting team to quickly generate detailed, accurate proposals for storefront projects. Once a quote is converted to an order, WDQ automatically generates all necessary production documents needed to efficiently process glass and extrusions.",
  },
  {
    title: "SALES iQ",
    image: "/images/features/crm.png",
    description:
      "Our built-in CRM empowers your sales team to manage relationships with both prospective and active customers while giving management real-time insights into pipeline activity. Sales iQ also includes a full email marketing campaign system, letting you send automated, personalized emails to any contact.",
  },
  {
    title: "SAFE & SECURE",
    image: "/images/features/backup.png",
    description:
      "Never lose your company's valuable data with daily backups on our ISO/IEC 27001:2013 certified SSD SQL servers, running on a hardware RAID controller with RAID 10 for optimized performance and redundancy. Weekly vulnerability scans are performed by Detectify, with firewall protection from Windows Firewall and antivirus protection from Malwarebytes. Our code is also reviewed using Claude Code for added quality assurance.",
  },
  {
    title: "PRICING",
    image: "/images/features/pricing.png",
    description:
      "Dial in precise pricing for every product and customer. From glass configurations to two-tone colors to bulk price adjustments, manufacturers can quickly and easily update pricing using WDQ. Products can be priced using list pricing or cost-plus, powered by our detailed bill of materials.",
  },
  {
    title: "AVALARA SALES TAX INTEGRATION",
    image: "/images/features/avalara.png",
    description:
      "Automatically calculate accurate sales tax on every quote and invoice with our built-in Avalara integration. Rates are determined in real time based on jurisdiction, product taxability, and customer exemption status, so you never have to manually look up rates or maintain your own tax tables. Stay compliant everywhere you sell.",
  },
  {
    title: "INTEGRATED PAYMENTS",
    image: "/images/features/cardconnect.png",
    description:
      "Accept ACH, credit card, and debit card payments directly within WDQ through our CardConnect integration. Customers can pay invoices online without a phone call or manual entry, funds post automatically, and payment status updates in real time so your team always knows exactly where an order stands.",
  },
  {
    title: "QUICKBOOKS INTEGRATION",
    image: "/images/features/quickbooks.png",
    description:
      "Sync quotes, invoices, and customer records directly with QuickBooks Online or QuickBooks Desktop. Eliminate double entry between your sales and accounting teams, and keep everyone working from the same numbers. Payments and invoices flow automatically between systems, saving hours of manual reconciliation and reducing costly data-entry errors.",
  },
] as const;

export const clients = [
  { name: "EnerLux", src: "/images/clients/enerlux.png", href: "http://enerluxwindows.com/" },
  { name: "Rivertown", src: "/images/clients/rivertown.png", href: "http://www.rivertownwindows.com/" },
  { name: "FiberFrame", src: "/images/clients/fiberframe.png", href: "http://fiberframe.com" },
  { name: "Otiima", src: "/images/clients/otiima.png", href: "http://otiimausa.com" },
  { name: "American Window Systems", src: "/images/clients/american-window.png", href: "https://www.americanwindowsystems.com/" },
  { name: "Buena Vista", src: "/images/clients/buena-vista.png", href: "https://buenavistawindows.net" },
  { name: "French Steel", src: "/images/clients/frenchsteel.png", href: "https://frenchsteel.com/" },
  { name: "Herschberger", src: "/images/clients/herschberger.png", href: "https://herschbergerwindows.com/" },
  { name: "Premier Door", src: "/images/clients/premier-door.png", href: "https://www.premierdoor.org/" },
  { name: "Mia Puerta", src: "/images/clients/mia.png", href: "https://www.miapuerta.com" },
  { name: "Coastal Sash & Door", src: "/images/clients/coastal.png", href: "https://coastalsashanddoor.com/" },
  { name: "FlexScreen", src: "/images/clients/flexscreen.png", href: "https://flexscreen.com" },
  { name: "Don's Windows", src: "/images/clients/dons.png", href: "http://donswindows.com" },
  { name: "Nova", src: "/images/clients/nova.png", href: "https://novafiberglass.com/" },
  { name: "LuxView", src: "/images/clients/luxview.png", href: "https://luxviewsystems.com/" },
  { name: "Windows & Doors", src: "/images/clients/windows-doors.png", href: "#" },
  { name: "GlassExpanse", src: "/images/clients/glassexpanse.png", href: "https://glassexpanse.com" },
  { name: "Park Vue", src: "/images/clients/parkvue.png", href: "https://www.park-vue.com/" },
  { name: "Mosaic", src: "/images/clients/mosaic.png", href: "https://mosaicwd.com" },
  { name: "Taylors", src: "/images/clients/taylors.png", href: "https://www.taylorswindows.com/" },
  { name: "Usonia", src: "/images/clients/usonia.png", href: "https://usonialife.com" },
  { name: "Vinco", src: "/images/clients/vinco.png", href: "http://vincowindows.com" },
  { name: "CD Windows", src: "/images/clients/cdw.png", href: "http://cdwindows.com" },
  { name: "Viva", src: "/images/clients/viva.png", href: "http://vivawindows.com/" },
  { name: "Tri-State", src: "/images/clients/tristate.jpg", href: "http://tristatecustomwindows.com" },
  { name: "General Impact", src: "/images/clients/general-impact.png", href: "http://generalimpact.com" },
  { name: "Inkster", src: "/images/clients/inkster.png", href: "http://inksterpark.ca/" },
  { name: "Accent", src: "/images/clients/accent.jpg", href: "http://accentspecialty.com" },
  { name: "Steel Traditions", src: "/images/clients/steel-traditions.png", href: "https://steeltraditions.com/" },
  { name: "ThermoSeal", src: "/images/clients/thermoseal.jpg", href: "https://www.thermoseal.net/" },
  { name: "Stellar", src: "/images/clients/stellar.png", href: "https://www.stellarwd.com/" },
  { name: "RiteScreen", src: "/images/clients/ritescreen.png", href: "https://ritescreen.com" },
  { name: "Advanced Windows", src: "/images/clients/advanced.png", href: "https://advancedwindowsusa.com/" },
  { name: "Paramount", src: "/images/clients/paramount.png", href: "https://www.paramountwindowsanddoors.com" },
  { name: "Downey Glass", src: "/images/clients/downey.jpg", href: "https://downeyglass.com" },
  { name: "AMW", src: "/images/clients/amw.jpg", href: "https://www.americanwindowmfg.com/" },
  { name: "Gilwin", src: "/images/clients/gilwin.png", href: "https://gilwin.com/" },
  { name: "Koch", src: "/images/clients/koch.png", href: "https://kochandco.com/" },
  { name: "H-Window", src: "/images/clients/hwindow.png", href: "https://hwindow.com" },
  { name: "Jantek", src: "/images/clients/jantek.jpg", href: "https://jantekwindows.com/" },
] as const;

export const testimonials = [
  {
    author: "Scott Braun",
    role: "Production Manager, EnerLux Windows & Doors",
    quote:
      "The window and door quoting software from WinDoor has enabled us to support and grow our dealer network. Before, we were using Excel based price sheets that forced our dealers to manually quote out each project, which was time consuming and not always accurate. This was our single biggest obstacle in developing our dealer network. Now, our dealers receive instant and accurate pricing with visuals that make it easy for their customers to see what is being quoted.",
  },
  {
    author: "Jim Pesicka",
    role: "Sales Manager, FlexScreen South Dakota",
    quote:
      "The WDQ team has been a professional group to work with from the initial business process review to the development and implementation stage. We continue to work closely together on developing custom software solutions for our requirements. As our needs change due to customer requests and processing, WDQ has made a complex ordering and production process seem simple. This has enabled us to maximize our flexibility and profitability.",
  },
] as const;

export const team = [
  {
    name: "PAUL",
    role: "Director of Sales",
    image: "/images/team/paul.jpg",
    bio: "Paul is a graduate of Texas Christian University and a seasoned veteran of the window and door industry, having started and sold one of the premier fiberglass window and door manufacturers in North America. Paul serves as the chief software architect and sales representative for WinDoor Quote. In his free time, Paul enjoys hanging out with his family, bicycling, canoeing and playing board games.",
  },
  {
    name: "Girish",
    role: "Director of Development",
    image: "/images/team/girish.jpg",
    bio: "Girish has a Masters Degree is computer application development and is a full stack software developer, having eight plus years of experience in the IT Industry, with an expertise in C#, JavaScript, vb.net, CSS, and Typescript. Girish has developed large ERP systems for the mining industry, automated flight scheduling software and small-scale business software solutions. Girish heads the software development division for WinDoor Quote. In his free time, Girish enjoys traveling, watching movies and exploring upcoming technologies.",
  },
  {
    name: "FRAN",
    role: "Account Executive",
    image: "/images/team/fran.jpg",
    bio: "Fran graduated from the University of Nebraska – Lincoln's Raikes School giving her a leg up for a career that blends business and tech. She has been in software since 2013 in both implementation and development roles, with most of that time in ERP software for the building materials industry. Fran works with new customers to get up and running and cover ongoing customer support and relationships. Fran has a lot of interests in life, but when forced to pick just a few, she especially loves traveling, being outdoors with her husband and two young kids, and growing/cooking/eating good food.",
  },
  {
    name: "VIKAS",
    role: "Director of Quality Control",
    image: "/images/team/vikas.jpg",
    bio: "Vikas earned a Masters Degree is computer application development and is a full stack software developer, having four plus years of experience in the IT Industry, with an expertise in asp.net, C#, JavaScript, CSS, and Typescript. Vikas has developed Ecommerce sites, google ad-sense development and small-scale business software solutions. Vikas programs and develops new modules and customer requested modifications for WinDoor Quote. In his free time, Vikas enjoys music, watching movies and hanging out with friends.",
  },
  {
    name: "JULIANNE",
    role: "Implementation Specialist",
    image: "/images/team/julianne.jpg",
    bio: "Julianne has over 25 years of experience in the window and door industry. She started her career working for a vinyl window manufacturer while attending college. After graduation, she worked with an attorney, putting her degree to use. Julianne then worked as an office manager for another vinyl window manufacturer before moving on to a fiberglass window manufacturer where she worked her way up to Director of Operations. Throughout her career, Julianne has worked with several software and ERP programs designed for the window industry. With her extensive experience in the window and door industry she is an asset as an Implementation Specialist for WDQ. She is passionate about helping customers set up WDQ to their company's unique style and is committed to providing excellent service and support. In her free time, Julianne likes to fish, spend time with her husband and daughter and getting together with family and friends for game nights.",
  },
] as const;

export const videos = [
  {
    title: "New Line Item",
    href: "https://www.youtube.com/watch?v=sqO_Iu3OhV8",
    thumb: "/images/videos/line-item.gif",
  },
  {
    title: "Group Change",
    href: "https://www.youtube.com/watch?v=eUAEGbWZ6W0",
    thumb: "/images/videos/group-change.gif",
  },
  {
    title: "New Quote",
    href: "https://www.youtube.com/watch?v=Knw11C1nK08",
    thumb: "/images/videos/new-quote.gif",
  },
  {
    title: "CRM",
    href: "https://youtu.be/UCitt-6swIk",
    thumb: "/images/videos/crm.png",
  },
  {
    title: "Custom Shapes",
    href: "https://www.youtube.com/watch?v=KT0sIycYRJM",
    thumb: "/images/videos/shapes.gif",
  },
  {
    title: "Grilles",
    href: "https://www.youtube.com/watch?v=ZrQyzQQnip0",
    thumb: "/images/videos/grilles.jpg",
  },
] as const;

export const aboutText =
  "Taking the complex and making it simple is our mission. Based in Omaha, Nebraska, WDQ provides cloud based software for window, door, and screen manufacturers. WDQ is a fast, reliable, flexible, and intuitive system that will help your company increase sales and process those sales more accurately and efficiently. With our extensive hands on experience in window and door manufacturing and sales, we are able to have insightful conversations with our customers, leading to optimal solutions that are achieved in a time and cost-efficient manner. If you manufacture fenestration products and are looking for an ERP and Quoting software to tie your entire business together under one software system, contact us to find out how we can help.";
