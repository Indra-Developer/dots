import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const baseUrl = "https://www.dotstaxfilings.com";

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  try {
    const servicesRef = collection(db, "services");
    
    // FIX: Added the active == true filter to satisfy Firestore rules
    const q = query(
      servicesRef, 
      where("status", "==", "published"),
      where("active", "==", true)
    );
    
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const service = doc.data();
      
      if (service.slug) {
        const dateObj = service.updatedAt?.seconds 
          ? new Date(service.updatedAt.seconds * 1000) 
          : new Date();
        const lastMod = dateObj.toISOString().split('T')[0];

        xml += `
  <url>
    <loc>${baseUrl}/services/${service.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  xml += `\n</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate'); 
  
  res.status(200).send(xml);
}