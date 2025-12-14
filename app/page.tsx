"use client"

import { useState, useEffect } from "react";
import LoginPage from "@/components/login-page"; 
import Dashboard from "@/components/dashboard"; 

export default function Home() {
  // 1. DÉCLARATION DES VARIABLES (STATE)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. TAF3IL L-MÉMOIRE (useEffect): Kaykhddem ghir mrra w7da
  useEffect(() => {
    // Kanjjbdou 'userLoggedIn' mn l-Mémoire
    const savedLogin = localStorage.getItem("userLoggedIn"); 
    if (savedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // 3. FONCTION SUCCESS LOGIN (Melli t-dkhl b succès)
  // Hadi katkhdem ghir melli LoginPage t-goul: "Safé, ra dkhlna"
  const handleSuccessLogin = () => {
    setIsLoggedIn(true);
    // Note: L-Mémoire (localStorage.setItem) ghadi ydirha LoginPage bo7dha
  };

  // 4. FONCTION DÉCONNEXION (Logout)
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Ms7 l-Mémoire dyal Browser bach maybqa 3aqlch
    localStorage.removeItem("userLoggedIn"); 
    // Y3awd y-ch3l l-page bach yrj3 l-Login
    window.location.reload(); 
  };
  
  // 5. L-AFFICHAGE
  return (
    <>
      {isLoggedIn ? (
        // Ila kan logged in: Affiche Dashboard w sift lih handleLogout
        <Dashboard onLogout={handleLogout} /> 
      ) : (
        // Sinon: Affiche Login Page w sift lih handleSuccessLogin
        <LoginPage 
          onLogin={handleSuccessLogin} 
        />
      )}
    </>
  );
}