export type GalleryCategory = "Day" | "Evening" | "Night" | "Exterior" | "Interior" | "Festivals";

export type TemplePhoto = {
  id: string;
  src: string;
  caption: string;
  hindi: string;
  categories: GalleryCategory[];
  description?: string;
  date?: string;
  featured?: boolean;
};

const publicAsset = (path: string) => encodeURI(path);
const photoAsset = (path: string) =>
  publicAsset(`/optimized${path.replace(/\.(?:jpe?g|png)$/i, ".jpg")}`);

export const TEMPLE_LOGO = publicAsset("/logo.png");

export const HERO_IMAGE = publicAsset("/Banner.png");

const EVENING_SUNSET_IMAGE = photoAsset("/Temple images/Evening view/IMG20260609174111.jpg");

export const TEMPLE_PHOTOS: TemplePhoto[] = [
  {
    id: "featured-evening",
    src: photoAsset("/Temple images/Edited/Image Jun 10, 2026, 01_38_39 PM.png"),
    caption: "Featured evening portrait of the mandir",
    hindi: "संध्या में मंदिर का विशेष दृश्य",
    categories: ["Evening", "Exterior"],
  },
  {
    id: "day-front",
    src: photoAsset("/Temple images/Day view/img12.jpg"),
    caption: "Front approach to the temple",
    hindi: "मंदिर का मुख्य प्रवेश दृश्य",
    categories: ["Day", "Exterior"],
  },
  {
    id: "day-roadside",
    src: photoAsset("/Temple images/Day view/img13.jpg"),
    caption: "Temple and village approach",
    hindi: "मंदिर तक गाँव का मार्ग",
    categories: ["Day", "Exterior"],
  },
  {
    id: "day-side",
    src: photoAsset("/Temple images/Day view/img14.jpg"),
    caption: "Temple facade in daylight",
    hindi: "दिन में मंदिर का बाहरी दृश्य",
    categories: ["Day", "Exterior"],
  },
  {
    id: "evening-side",
    src: photoAsset("/Temple images/Evening view/IMG20260609173017.jpg"),
    caption: "Quiet evening beside the mandir",
    hindi: "मंदिर की शांत संध्या",
    categories: ["Evening", "Exterior"],
  },
  {
    id: "evening-sunset",
    src: EVENING_SUNSET_IMAGE,
    caption: "Sunset behind the temple shikhara",
    hindi: "शिखर के पीछे सूर्यास्त",
    categories: ["Evening", "Exterior"],
  },
  {
    id: "evening-path",
    src: photoAsset("/Temple images/Evening view/IMG20260609174113.jpg"),
    caption: "Evening view from the entrance path",
    hindi: "प्रवेश मार्ग से संध्या दर्शन",
    categories: ["Evening", "Exterior"],
  },
  {
    id: "night-front",
    src: photoAsset("/Temple images/Night view/IMG_20260609_194333.jpg"),
    caption: "Temple illuminated after dusk",
    hindi: "संध्या के बाद प्रकाशित मंदिर",
    categories: ["Night", "Exterior"],
  },
  {
    id: "night-wide",
    src: photoAsset("/Temple images/Night view/img1.jpg"),
    caption: "Colourful night view of the mandir",
    hindi: "रात्रि में रंगीन मंदिर दर्शन",
    categories: ["Night", "Exterior"],
  },
  {
    id: "night-lights",
    src: photoAsset("/Temple images/Night view/img2.jpg"),
    caption: "Festival lights across the shikhara",
    hindi: "शिखर पर उत्सव की रोशनी",
    categories: ["Night", "Exterior"],
  },
  {
    id: "night-distance",
    src: photoAsset("/Temple images/Night view/img3.jpg"),
    caption: "Mandir lights seen across the grounds",
    hindi: "प्रांगण से रात्रि दर्शन",
    categories: ["Night", "Exterior"],
  },
  {
    id: "interior-shivling",
    src: photoAsset("/Temple images/interior view/img20260610.webp"),
    caption: "Sacred Shivling in the sanctum",
    hindi: "गर्भगृह में पवित्र शिवलिंग",
    categories: ["Interior"],
  },
  {
    id: "interior-doorway",
    src: photoAsset("/Temple images/interior view/Screenshot 2026-06-10 170855.png"),
    caption: "Entrance to the inner sanctum",
    hindi: "गर्भगृह का प्रवेश द्वार",
    categories: ["Interior"],
  },
  {
    id: "interior-altar",
    src: photoAsset("/Temple images/interior view/Screenshot 2026-06-10 170946.png"),
    caption: "Shivling prepared for worship",
    hindi: "पूजन के लिए सुसज्जित शिवलिंग",
    categories: ["Interior"],
  },
  {
    id: "interior-gate",
    src: photoAsset("/Temple images/interior view/Screenshot 2026-06-10 171015.png"),
    caption: "Darshan through the sanctum gate",
    hindi: "गर्भगृह द्वार से दर्शन",
    categories: ["Interior"],
  },
  {
    id: "interior-deities",
    src: photoAsset("/Temple images/interior view/Screenshot 2026-06-10 171110.png"),
    caption: "Sacred deities inside the temple",
    hindi: "मंदिर के पवित्र देव स्वरूप",
    categories: ["Interior"],
  },
  {
    id: "interior-wide",
    src: photoAsset("/Temple images/interior view/Screenshot 2026-06-10 171134.png"),
    caption: "A quiet view inside the sanctum",
    hindi: "गर्भगृह का शांत दृश्य",
    categories: ["Interior"],
  },
  {
    id: "interior-threshold",
    src: photoAsset("/Temple images/interior view/Screenshot 2026-06-10 171157.png"),
    caption: "Shivling seen from the threshold",
    hindi: "द्वार से शिवलिंग दर्शन",
    categories: ["Interior"],
  },
  {
    id: "interior-darshan",
    src: photoAsset("/Temple images/interior view/Screenshot 2026-06-10 171209.png"),
    caption: "Inner sanctum darshan",
    hindi: "अंतर मंदिर दर्शन",
    categories: ["Interior"],
  },
  {
    id: "interior-offerings",
    src: photoAsset("/Temple images/interior view/Screenshot 2026-06-10 171259.png"),
    caption: "Offerings arranged around the Shivling",
    hindi: "शिवलिंग के पास पूजा सामग्री",
    categories: ["Interior"],
  },
  {
    id: "interior-close",
    src: photoAsset("/Temple images/interior view/Screenshot 2026-06-10 171315.png"),
    caption: "Close darshan of the decorated Shivling",
    hindi: "सुसज्जित शिवलिंग का निकट दर्शन",
    categories: ["Interior"],
  },
  {
    id: "festival-night",
    src: photoAsset("/Temple images/Festival images/festival1.png"),
    caption: "Devotees gather beneath the festival lights",
    hindi: "उत्सव की रोशनी में भक्तों का समागम",
    categories: ["Festivals"],
  },
  {
    id: "festival-gathering",
    src: photoAsset("/Temple images/Festival images/festival2.png"),
    caption: "Community celebration in the temple grounds",
    hindi: "मंदिर प्रांगण में सामुदायिक उत्सव",
    categories: ["Festivals"],
  },
  {
    id: "festival-offering",
    src: photoAsset("/Temple images/Festival images/festival4.jpg"),
    caption: "Floral devotional offering",
    hindi: "पुष्पों से सजी भक्ति अर्पणा",
    categories: ["Festivals"],
  },
];

const photoById = new Map(TEMPLE_PHOTOS.map((photo) => [photo.id, photo]));
const selectPhotos = (ids: string[]) =>
  ids.map((id) => photoById.get(id)).filter((photo): photo is TemplePhoto => Boolean(photo));

export const ABOUT_SLIDES = selectPhotos([
  "day-front",
  "evening-sunset",
  "night-lights",
  "interior-close",
  "festival-gathering",
  "day-side",
]);

export const GALLERY_PREVIEW = selectPhotos([
  "featured-evening",
  "evening-sunset",
  "night-lights",
  "interior-close",
  "festival-gathering",
  "day-front",
  "interior-doorway",
  "night-front",
]);

export const TEMPLE_GLIMPSES = selectPhotos([
  "featured-evening",
  "day-front",
  "evening-sunset",
  "night-lights",
  "interior-close",
  "festival-gathering",
  "day-side",
  "night-front",
  "festival-offering",
]);

export type VideoCategory = "Temple Introduction" | "Highlights" | "Festivals & Events Activities";

export type TempleVideo = {
  id: string;
  src: string;
  embedUrl?: string;
  poster?: string;
  title: string;
  hindi: string;
  description: string;
  duration?: string;
  date?: string;
  featured?: boolean;
  category: VideoCategory;
};
