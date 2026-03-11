import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Shield, Loader2, ArrowRight } from "lucide-react";
import { Button, Input, Card, Alert } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

/**
 * Dedicated Admin Login Page
 * Used as a gateway for the /admin dashboard
 */
const AdminLoginPage = ({ onVerify }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Check the dedicated 'admins' collection in Firestore
            const adminsRef = collection(db, "admins");
            const q = query(adminsRef, where("email", "==", email), where("password", "==", password));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Valid admin found in the database. 
                // CRITICAL: We MUST authenticate with Firebase Auth to get an access token for security rules.
                const authRes = await signIn(email, password);
                if (!authRes.success) {
                     // The admin is in the DB but hasn't been registered in Firebase Auth yet. Do it now!
                     const { createUserWithEmailAndPassword } = await import("firebase/auth");
                     const { auth } = await import("../../firebase");
                     try {
                         await createUserWithEmailAndPassword(auth, email, password);
                         console.log("Auto-created Firebase Auth account for existing DB admin.");
                     } catch (err) {
                         console.error("Could not create Firebase Auth account:", err);
                     }
                }
                
                sessionStorage.setItem("admin_verified", "true");
                sessionStorage.setItem("admin_email", email);
                onVerify(true);
                setLoading(false);
                return;
            } else {
                // If not found in DB, provide a temporary emergency fallback just to prevent total lockout
                // while the user sets up the database collection.
                if (email === "admin@bluecare.com" && password === "admin789") {
                    console.warn("Used emergency fallback. Auto-creating admin in database for future use.");
                    
                    // CRITICAL: We MUST authenticate with Firebase Auth to get a token, 
                    // otherwise Firestore Security Rules will block all writes (like creating brands).
                    const authRes = await signIn(email, password);
                    if (!authRes.success) {
                         // Real auth user doesn't exist yet, let's create it!
                         const { createUserWithEmailAndPassword } = await import("firebase/auth");
                         const { auth } = await import("../../firebase");
                         try {
                             await createUserWithEmailAndPassword(auth, email, password);
                             console.log("Auto-created Firebase Auth account for fallback admin.");
                         } catch (err) {
                             console.error("Could not create Firebase Auth account, writes may fail:", err);
                         }
                    }

                    try {
                        await addDoc(adminsRef, {
                            email: email,
                            password: password,
                            role: "Super Admin",
                            createdAt: new Date()
                        });
                        toast.success("Admin credentials saved to database!");
                    } catch (e) {
                        console.error("Could not auto-create admin doc (check Firestore rules):", e);
                    }

                    sessionStorage.setItem("admin_verified", "true");
                    sessionStorage.setItem("admin_email", email);
                    onVerify(true);
                    setLoading(false);
                    return;
                }

                setError("Invalid administrator credentials.");
            }
        } catch (err) {
            console.error("Admin login error:", err);

            // Fallback if rules completely block the read attempt before the collection exists
            if (email === "admin@bluecare.com" && password === "admin789") {
                console.warn("Database blocked the request. Using emergency fallback.");
                
                // CRITICAL Auth registration
                const authRes = await signIn(email, password);
                if (!authRes.success) {
                     const { createUserWithEmailAndPassword } = await import("firebase/auth");
                     const { auth } = await import("../../firebase");
                     try {
                         await createUserWithEmailAndPassword(auth, email, password);
                     } catch (err) {
                         console.error("Could not create Firebase Auth account:", err);
                     }
                }

                sessionStorage.setItem("admin_verified", "true");
                sessionStorage.setItem("admin_email", email);
                onVerify(true);
                setLoading(false);
                return;
            }

            setError("Server connection failed or access denied.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[440px]"
            >
                {/* Logo Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
                    <p className="text-slate-500 font-medium mt-1">Provide credentials to access management tools</p>
                </div>

                <Card className="p-8 border-slate-100 shadow-2xl shadow-blue-50/50 rounded-3xl">
                    <form onSubmit={handleAdminLogin} className="space-y-5">
                        {error && (
                            <Alert variant="danger" message={error} />
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-slate-700 ml-1">Administrator Email</label>
                            <Input
                                type="email"
                                placeholder="admin@bluecare.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-4 h-4" />}
                                required
                                className="h-12 border-slate-200 focus:border-blue-500 rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[13px] font-bold text-slate-700">Security Password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock className="w-4 h-4" />}
                                    required
                                    className="h-12 border-slate-200 focus:border-blue-500 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                disabled={loading}
                                className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
                                icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                                iconPosition="right"
                            >
                                {loading ? "Verifying..." : "Unlock Dashboard"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                        <button
                            onClick={() => navigate("/")}
                            className="text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Return to Public Storefront
                        </button>
                    </div>
                </Card>

                <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <Shield className="w-3 h-3" />
                    <span>Secure Encrypted Connection</span>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
