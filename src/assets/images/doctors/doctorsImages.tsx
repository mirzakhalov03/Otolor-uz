import doctor1 from "./doctor1.jpg"
import doctor2 from "./doctor2.jpg"
import doctor3 from "./doctor3.jpg"
import doctor5 from "./doctor5.jpg"
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
        title: "Otoneyrojarroh"
    },
    {
        src: doctor2,
        alt: "Tuyg'un Muzaffarov",
        name: "Tuyg'un Muzaffarov",
        title: "Bosh va bo'yin jarrohi"
    },
    {
        src: doctor5,
        alt: "Doctor",
        name: "Nodir Shoazizov",
        title: "LOR shifokori"
    },
    {
        src: doctor7,
        alt: "Doctor",
        name: "Muhammadamin Rahmatullayev",
        title: "LOR shifokori"
    },
    {
        src: doctor3,
        alt: "Sherzod Botirov",
        name: "Sherzod Botirov",
        title: "LOR shifokori"
    },
    
    {
        src: doctor9,
        alt: "Doctor",
        name: "Jasur Ibragimov",
        title: "LOR shifokori"
    },
    {
        src: doctor10,
        alt: "Doctor",
        name: "Hindol Salomov",
        title: "LOR shifokori"
    },
    {
        src: doctor11,
        alt: "Doctor",
        name: "Chehron Niyazov",
        title: "LOR shifokori"
    },
    {
        src: doctor8,
        alt: "Doctor",
        name: "Inoyatullo Raximov",
        title: "LOR shifokori"
    },
]