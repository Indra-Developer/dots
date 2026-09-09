import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Initialize Firebase using standard process.env variables for Vercel
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const baseUrl = "https://www.dotstaxfilings.com";

  // Start the XML output
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  try {
    const servicesRef = collection(db, "services");
    const q = query(servicesRef, where("status", "==", "published"));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const service = doc.data();
      
      if (service.slug) {
        // Safely parse the Firestore timestamp for serverless environments
        const dateObj = service.updatedAt?.seconds 
          ? new Date(service.updatedAt.seconds * 1000) 
          : new Date();
        const lastMod = dateObj.toISOString().split('T')[0];

        xml += `
  <url>
    <loc>${baseUrl}/services/${service.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      }
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  // Close the XML tag
  xml += `\n</urlset>`;

  // Tell the browser and crawlers this is an XML file
  res.setHeader('Content-Type', 'text/xml');
  // Cache the sitemap on Vercel's Edge Network for 1 hour to prevent database spam
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); 
  
  res.status(200).send(xml);
}