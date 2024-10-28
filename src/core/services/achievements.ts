import { doc, updateDoc, collection, getDocs, setDoc, getDoc, increment } from "firebase/firestore";
import { db, auth } from "@/core/plugins/firebase"; // นำเข้า firebase config
import { CollectionReference } from "firebase/firestore";

// ตรวจสอบและอัปเดต Achievements
const checkAchievements = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const achievementsRef = collection(userRef, "achievements");

  // ดึงข้อมูลผู้ใช้
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();

  // ตรวจสอบ Achievement ต่างๆ ตามเงื่อนไข
  if (userData?.consecutiveWins === 3) {
    await unlockAchievement(achievementsRef, "3 Wins in a Row", "Win 3 games consecutively");
  }

  if (userData?.score >= 100) {
    await unlockAchievement(achievementsRef, "Score of 100", "Achieve a score of 100 points");
  }

  // Achievement: ชนะครั้งแรก
  const achievementsSnap = await getDocs(achievementsRef);
  const firstWin = achievementsSnap.docs.find(doc => doc.id === "First Win");
  if (!firstWin && userData?.score >= 1) {
    await unlockAchievement(achievementsRef, "First Win", "Win your first game");
  }
};

// ฟังก์ชันสำหรับปลดล็อก Achievement
const unlockAchievement = async (
  achievementsRef: CollectionReference,
  name: string,
  description: string
) => {
  await setDoc(doc(achievementsRef, name), {
    name,
    description,
    achieved: true,
    dateAchieved: new Date(),
  });
  console.log(`Unlocked achievement: ${name}`);
};

// ฟังก์ชันการเพิ่มคะแนนและอัปเดตจำนวนการชนะ
const updateScoreAndConsecutiveWins = async (win: boolean) => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  if (win) {
    await updateDoc(userRef, {
      score: increment(1),
      consecutiveWins: increment(1),
    });
  } else {
    await updateDoc(userRef, {
      score: increment(-1),
      consecutiveWins: 0, // รีเซ็ตจำนวนการชนะติดต่อกัน
    });
  }

  // ตรวจสอบ Achievements ทุกครั้งที่อัปเดตคะแนน
  await checkAchievements();
};

export { checkAchievements, updateScoreAndConsecutiveWins };
