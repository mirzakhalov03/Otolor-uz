import doctor1 from "./doctor1.jpg"
import doctor2 from "./doctor2.jpg"
import doctor3 from "./doctor3.jpg"
import doctor4 from "./doctor4.jpg"
import doctor5 from "./doctor5.jpg"
import doctor6 from "./doctor6.jpg"
import doctor7 from "./doctor7.jpg"
import doctor8 from "./doctor8.jpg"
import doctor9 from "./doctor9.jpg"
import doctor10 from "./doctor10.jpg"
import doctor11 from "./doctor11.jpg"


export interface DoctorImage {
    src: string;
    alt: string;
    name: string;
    title: string;
}

export const doctorsImages: DoctorImage[] = [
    {
        src: doctor1,
        alt: "Sherzod Gulyamov",
        name: "Sherzod Gulyamov",
        title: "ENT Specialist"
    },
    {
        src: doctor2,
        alt: "Tuyg'un Muzaffarov",
        name: "Tuyg'un Muzaffarov",
        title: "Head & Neck Surgeon"
    },
    {
        src: doctor3,
        alt: "Sherzod Botirov",
        name: "Sherzod Botirov",
        title: "ENT Specialist"
    },
    {
        src: doctor4,
        alt: "Doctor",
        name: "Dr. Abdulaziz",
        title: "Audiologist"
    },
    {
        src: doctor5,
        alt: "Doctor",
        name: "Dr. Sardor",
        title: "ENT Specialist"
    },
    {
        src: doctor6,
        alt: "Doctor",
        name: "Dr. Javohir",
        title: "Rhinologist"
    },
    {
        src: doctor7,
        alt: "Doctor",
        name: "Dr. Olim",
        title: "ENT Specialist"
    },
    {
        src: doctor8,
        alt: "Doctor",
        name: "Dr. Bekzod",
        title: "Pediatric ENT"
    },
    {
        src: doctor9,
        alt: "Doctor",
        name: "Dr. Rustam",
        title: "ENT Specialist"
    },
    {
        src: doctor10,
        alt: "Doctor",
        name: "Dr. Akmal",
        title: "ENT Specialist"
    },
    {
        src: doctor11,
        alt: "Doctor",
        name: "Dr. Dilshod",
        title: "ENT Specialist"
    },
]