import GradientBlinds from "@/components/modules/gradient-blinds/GradientBlinds";
import PostList from "@/components/PostList";
import { getAllPosts, getCategories } from "@/lib/actions";
import styles from "./page.module.css";

export default async function Home() {
  // Fetch initial data for the post list
  const [initialPosts, categories] = await Promise.all([
    getAllPosts(),
    getCategories()
  ]);

  return <main>
    <div style={{
      marginTop: "-80px",
      width: "100vw",
      height: "50vh",
      minHeight: "600px",
      overflow: "hidden",
      position: "relative"
    }} className={styles.hero}>
      <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={25}
          noise={0.3}
          blindCount={18}
          blindMinWidth={50}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
      />
      <div className={styles.cover}>

      </div>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "white",
        textAlign: "left",
        zIndex: 2,
        padding: "24px",
        borderRadius: "20px",
        maxWidth: "700px",
        width: "90%",
        display: "flex",
        gap: "12px"
      }}>
        <div style={{
          flexShrink: 0,
          width: "60px",
          height: "60px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "12px",
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            background: "linear-gradient(135deg, #ffffff, #e0e0e0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
            lineHeight: "1.3"
          }}>NXBlogs</h1>
          <p style={{
            fontSize: "1.2rem",
            margin: 0,
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            lineHeight: "1.5",
            opacity: "0.95",
            maxWidth: "500px"
          }}>Your go-to platform for writing and sharing stories.</p>
        </div>
      </div>
    </div>
    
    {/* All Posts List */}
    <PostList initialPosts={initialPosts} categories={categories} />
  </main>
}
