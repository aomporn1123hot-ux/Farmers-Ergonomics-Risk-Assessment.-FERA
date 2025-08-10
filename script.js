// ==== Firebase SDK ====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZMJ6Xv6Nsy_f7Kb3SnK4soS0m3PkCgFc",
  authDomain: "fera-38125.firebaseapp.com",
  projectId: "fera-38125",
  storageBucket: "fera-38125.firebasestorage.app",
  messagingSenderId: "281508827972",
  appId: "1:281508827972:web:96f6b7481637194533fd11",
  measurementId: "G-M9R0MFJLQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ====== Event listener ของฟอร์ม ======
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const getVal = name => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? parseInt(el.value) : 0;
  };

  const upScore = 1;
  const ut = getVal("upperTime");
  const lowScore = 1;
  const lt = getVal("lowerTime");

  const f = getVal("force");
  const r = getVal("repetition");
  const t = getVal("twist");

  const upperMap = {
    1: [0, 0, 1, 2], 2: [0, 0, 1, 2], 3: [1, 2, 3], 4: [1, 2, 3],
    5: [2, 3], 6: [2, 3], 7: [2, 3], 8: [3], 9: [3], 10: [3]
  };
  const lowerMap = {
    1: [1, 2, 3], 2: [2, 3], 3: [3], 4: [3], 5: [3],
    6: [2, 3], 7: [2, 3], 8: [2, 3]
  };

  const upPosture = getVal("upperPosture");
  const lowPosture = getVal("lowerPosture");

  const utScore = (upperMap[upPosture]?.[ut]) ?? 0;
  const ltScore = (lowerMap[lowPosture]?.[lt]) ?? 0;

  const total = (upScore + utScore) * (lowScore + ltScore) + f + r + t;

  let level = "", image = "";
  if (total === 1) {
    level = "ระดับยอมรับได้ ท่าทางการปฏิบัติงานนั้นยังไม่ควรได้รับการปรับปรุง";
    image = "ยอมรับได้.jpg";
  } else if (total <= 3) {
    level = "ระดับต่ำ ท่าทางการปฏิบัติงานนั้นควรได้รับการปรับปรุงเล็กน้อย";
    image = "ต่ำ.jpg";
  } else if (total <= 7) {
    level = "ระดับปานกลาง ท่าทางการปฏิบัติงานนั้นควรได้รับการปรับปรุงเพิ่มเติม";
    image = "ปานกลาง.jpg";
  } else if (total <= 14) {
    level = "ระดับสูง ท่าทางการปฏิบัติงานนั้นควรได้รับการปรับปรุงเร่งด่วน";
    image = "สูง.jpg";
  } else {
    level = "ระดับสูงมาก ท่าทางการปฏิบัติงานนั้นควรได้รับการปรับปรุงในทันที";
    image = "สูงมาก.jpg";
  }

  // ==== บันทึกข้อมูลลง Firestore ====
  try {
    await addDoc(collection(db, "assessmentAnswers"), {
      upperPosture: upPosture,
      upperTime: ut,
      lowerPosture: lowPosture,
      lowerTime: lt,
      force: f,
      repetition: r,
      twist: t,
      totalScore: total,
      riskLevel: level,
      timestamp: new Date().toISOString()
    });
    console.log("บันทึกข้อมูลสำเร็จ");
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการบันทึก: ", err);
  }

  document.getElementById("resultText").textContent = `คะแนนรวม: ${total} (${level})`;
  document.getElementById("resultImage").src = image;
  showPage(5);
});
