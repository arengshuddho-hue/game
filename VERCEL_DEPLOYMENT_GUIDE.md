# 🕵️ The Detective's Desk - Vercel Deployment & Database Guide
**ভার্সেল ডিপ্লয়মেন্ট এবং ডাটাবেজ সেটআপ গাইড**

---

## 🌟 এক নজরে কী কী পরিবর্তন করা হয়েছে:
1. **Vercel Serverless Architecture:** পিএইচপি সার্ভার ছাড়াই ভার্সেলের নেটিভ এজ ও সার্ভারলেস ব্যাকএন্ড (`/api/*`) তৈরি করা হয়েছে, যাতে Vercel-এ ১-ক্লিকেই প্রোজেক্টটি চলে।
2. **ডুয়াল ডাটাবেজ সাপোর্ট (Zero-Crash Database):**
   - **ইনস্ট্যান্ট ফলব্যাক স্টোরেজ:** ভার্সেলে ডিপ্লয় করার সাথে সাথে কোনো ডাটাবেজ কনফিগারেশন ছাড়াই ইউজার রেজিস্ট্রেশন, লগিন ও স্কোর সেভ কাজ করবে! কোনো 500 এরর আসবে না।
   - **ক্লাউড MySQL সাপোর্ট:** TiDB Serverless, Aiven, Supabase, PlanetScale বা Railway-এর MySQL এক ক্লিকে যুক্ত করা যাবে।
3. **প্রিমিয়াম নোয়ার রিডিজাইন (Noir Investigation UI 2.0):**
   - ভিন্টেজ পুলিশ ডসিয়ার ফাইল ফোল্ডার ও ক্লিপবোর্ড লুক।
   - ৪টি ইন্টারেক্টিভ কেস ফাইল নেভিগেটর (Case 1, 2, 3, 4)।
   - অ্যানিমেটেড ইকুয়ালাইজার ও অ্যাম্বিয়েন্ট মিউজিক / সাউন্ড কন্ট্রোল বার।
   - ফরেনসিক হটস্পট ম্যাগনিফাইং রেটিকল ও পোলারয়েড সাসপেক্ট কার্ড।
   - ১-ক্লিক **"Instant Demo Detective"** লগিন বাটন (পরীক্ষা বা প্রিভিউয়ের সুবিধার্থে)।
   - এভিডেন্স কর্কবোর্ড ও ব্যুরো রেকর্ডস / লিডারবোর্ড ড্রয়ার।
   - সম্পূর্ণ ইংরেজি ও বাংলা দ্বিভাষিক সাপোর্ট।

---

## 🚀 পদ্ধতি ১: ভার্সেলে ডিপ্লয় করার সহজ নিয়ম (Vercel Dashboard)

1. এই প্রোজেক্টের ফোল্ডারটি আপনার **GitHub** একাউন্টে Push করুন:
   ```bash
   git init
   git add .
   git commit -m "Ready for Vercel with database & enhanced Noir UI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/the-detectives-desk.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com)-এ যান এবং আপনার GitHub দিয়ে লগিন করুন।
3. **"Add New Project"** এ ক্লিক করে আপনার রিপোজিটরিটি সিলেক্ট করে **"Import"** করুন।
4. কোনো স্পেশাল সেটিংস পরিবর্তন করার দরকার নেই। সরাসরি **"Deploy"** বাটনে ক্লিক করুন!
5. মাত্র ১ মিনিটে আপনার লাইভ গেম লিংক তৈরি হয়ে যাবে! 🎉

---

## ⚡ পদ্ধতি ২: Vercel CLI দিয়ে সরাসরি টার্মিনাল থেকে ডিপ্লয়

1. টার্মিনালে কমান্ড দিন:
   ```bash
   npm install -g vercel
   vercel
   ```
2. প্রম্পটগুলোতে `Enter` চাপুন। স্বয়ংক্রিয়ভাবে লাইভ লিংক পেয়ে যাবেন!

---

## 🗄️ ক্লাউড ডাটাবেজ (Cloud MySQL) যুক্ত করার নিয়ম (ঐচ্ছিক কিন্তু দারুণ)

আপনি যদি চান যে আপনার সব ইউজার এবং স্কোর চিরতরে একটি ফ্রি ক্লাউড ডাটাবেজে জমা হোক:

### সেরা ফ্রি ক্লাউড অপশন: **TiDB Serverless** (আজীবন ফ্রি)
1. [tidbcloud.com](https://tidbcloud.com)-এ গিয়ে একটি ফ্রি অ্যাকাউন্ট খুলুন।
2. **"Create Cluster"** -> **"Serverless"** সিলেক্ট করুন।
3. **"Connect"** বাটনে চাপ দিয়ে **Connect with: General / URL** নির্বাচন করুন।
4. সেখানে আপনি একটি লিংক পাবেন, যেমন:
   `mysql://2xxxx.root:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/detective_desk?ssl=true`
5. এবার **Vercel Dashboard**-এ আপনার প্রোজেক্টে যান:
   - **Settings** ➔ **Environment Variables**
   - **Key:** `MYSQL_URL`
   - **Value:** আপনার পাওয়া লিংকটি পেস্ট করে দিন।
   - **Save** করুন এবং **Redeploy** করুন।
6. ব্যাস! অ্যাপ্লিকেশনটি স্বয়ংক্রিয়ভাবে ডাটাবেজ টেবিল (`users`, `case_records`) তৈরি করে নেবে!

> **নোট:** আপনি যদি ক্লাউড ডাটাবেজ লিংক নাও দেন, তাহলেও কোনো সমস্যা নেই! প্রোজেক্টে স্বয়ংক্রিয় সেফ-স্টোরেজ দেওয়া আছে যাতে ডিপ্লয়মেন্ট কখনই নষ্ট না হয়।

---

## 💻 লোকাল মেশিনে টেস্ট করার নিয়ম (Local Dev)

### Node.js দিয়ে চালানো:
```bash
npm start
```
ব্রাউজারে ওপেন করুন: `http://localhost:3000`

### XAMPP (PHP) দিয়ে চালানো:
- আপনার XAMPP-এর `htdocs/game` ফোল্ডারে ফাইলগুলো রাখুন।
- Apache এবং MySQL চালু করুন।
- `database.sql` ফাইলটি phpMyAdmin-এ Import করুন।
- ব্রাউজারে `http://localhost/game/index.html` অথবা `game.php` ওপেন করুন।

