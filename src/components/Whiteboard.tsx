import React, { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "../lib/supabase"; // Supabase client'ımızın doğru şekilde import edildiğini varsayıyoruz
import {
  Eraser,
  Pencil,
  Trash2,
  Palette,
  User, // Kullanılmıyor gibi görünüyor, ama zararı yok
  LogOut,
  ChevronDown,
  Brush,
  Circle,
  Square,
  // Save, // Kullanılmıyor
  // Upload, // Kullanılmıyor
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  color: string;
  size: number;
  tool: "pen" | "eraser" | "brush" | "circle" | "square";
}

interface UserProfile {
  username: string;
  email: string;
}

// Button Bileşeni (size prop'u eklendi)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  children?: React.ReactNode;
  size?: string; // Toolbar'daki butonlarda kullanılıyor, tip hatasını gidermek için eklendi.
                 // Bu prop, mevcut stil mantığında doğrudan bir etki yaratmıyor.
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size, // Prop'u alıyoruz ama stil için kullanmıyoruz (mevcut implementasyonda)
  className,
  children,
  ...props
}) => {
  let buttonClasses =
    "rounded-full font-semibold px-3 py-1.5 text-sm transition-colors ";

  switch (variant) {
    case "ghost":
      buttonClasses += "bg-transparent text-gray-700 hover:bg-gray-100";
      break;
    default: // "default" varyantı, seçili araçlar için kullanılacak
             // Eğer seçili araç için farklı bir arka plan isteniyorsa (örn. bg-gray-200), burası güncellenmeli.
             // Orijinal kod: "bg-transparent hover:bg-gray-100"
             // Aktif araç için daha belirgin bir stil:
      buttonClasses += "bg-gray-200 text-gray-900 hover:bg-gray-300"; // Örnek: Aktif stil
      // Eğer orijinal stil (transparent) isteniyorsa:
      // buttonClasses += "bg-transparent hover:bg-gray-100";
      break;
  }

  return (
    <button className={`${buttonClasses} ${className || ""}`} {...props}>
      {children}
    </button>
  );
};


const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({
  text,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const generateUserAvatar = (username: string, email?: string) => {
  const avatarColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
  const hash = (username || email || "default")
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const color = avatarColors[hash % avatarColors.length];

  const nameInitials = username ? username.charAt(0).toUpperCase() : "";
  // Email'den ikinci bir initial almak yerine sadece username'in ilk iki harfini kullanabiliriz
  // veya username yoksa email'in ilk harfini alabiliriz.
  // Orijinal mantık: const emailInitials = email ? email.split("@")[0].charAt(0).toUpperCase() : "";
  // const initials = nameInitials + emailInitials;

  let initials = "";
  if (username) {
    initials = username.substring(0, username.includes(" ") ? 2 : 1).toUpperCase();
    if(username.includes(" ") && username.split(" ").length > 1) {
        initials = username.split(" ")[0][0].toUpperCase() + username.split(" ")[1][0].toUpperCase();
    } else {
        initials = username.substring(0, Math.min(username.length, 2)).toUpperCase();
    }
  } else if (email) {
    initials = email.charAt(0).toUpperCase();
  }


  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium"
      style={{ backgroundColor: color }}
    >
      {initials.substring(0, 2)}
    </div>
  );
};

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingId, setDrawingId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [tool, setTool] = useState<
    "pen" | "eraser" | "brush" | "circle" | "square"
  >("pen");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);
  const [showPalette, setShowPalette] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [multiUserDraw, setMultiUserDraw] = useState(false);
  const [currentShape, setCurrentShape] = useState<Line | null>(null);
  const navigate = useNavigate();

  const availableColors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF",
    "#808080", "#A52A2A", "#FFA500", "#800080",
  ];

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, line: Line) => {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();

      if (line.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 20; // Eraser size
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (const point of line.points) {
          ctx.lineTo(point.x, point.y);
        }
      } else if (line.tool === "brush") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size * 2; // Fırça daha kalın
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (const point of line.points) {
          ctx.lineTo(point.x, point.y);
        }
      } else if (line.tool === "pen") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size;
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (const point of line.points) {
          ctx.lineTo(point.x, point.y);
        }
      } else if (line.tool === "circle") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size;
        if (line.points.length < 2) return;
        const startX = line.points[0].x;
        const startY = line.points[0].y;
        const endX = line.points[line.points.length - 1].x;
        const endY = line.points[line.points.length - 1].y;
        const radius = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      } else if (line.tool === "square") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size;
        if (line.points.length < 2) return;
        const startX = line.points[0].x;
        const startY = line.points[0].y;
        const endX = line.points[line.points.length - 1].x;
        const endY = line.points[line.points.length - 1].y;
        const width = endX - startX;
        const height = endY - startY;
        ctx.strokeRect(startX, startY, width, height);
      }
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over"; // Reset for next draw
    },
    [] // color, size, tool bağımlılıkları draw fonksiyonunun kendisine ait değil,
       // dışarıdan gelen line objesi bunları içeriyor.
       // Bu nedenle useCallback bağımlılığı boş olabilir.
       // Ya da [color, size, tool] kalabilir, ancak bu draw fonksiyonunun yeniden oluşmasına neden olur.
       // line objesi tüm bilgiyi taşıdığı için boş array daha mantıklı olabilir.
  );

  // Kullanıcı profili ve varlık (presence) kanalı için useEffect
  useEffect(() => {
    const getProfileAndSetupPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (error) console.error("Error fetching profile:", error);
        
        const fetchedUserProfile = {
          username: profile?.username || user.email?.split("@")[0] || "User",
          email: user.email || "",
        };
        setUserProfile(fetchedUserProfile);

        // Presence channel setup after userProfile is potentially set
        const presChannel = supabase.channel("whiteboard-presence");
        presChannel
          .on("presence", { event: "sync" }, () => {
            const state = presChannel.presenceState();
            setMultiUserDraw(Object.keys(state).length > 1);
          })
          .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
              await presChannel.track({
                user_id: user.id, // user objesi burada hala geçerli
                username: fetchedUserProfile.username,
              });
            }
          });
        
        // Cleanup for presence channel
        return () => {
          supabase.removeChannel(presChannel);
        };

      } else {
        navigate("/login");
      }
    };

    const cleanupPromise = getProfileAndSetupPresence();
    
    return () => {
        cleanupPromise.then(cleanup => {
            if (typeof cleanup === 'function') {
                cleanup();
            }
        });
    };
  }, [navigate]);

  // Çizim verisini çekme ve drawingId'yi set etme
  useEffect(() => {
    const fetchDrawingData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login"); // Bu zaten yukarıdaki useEffect'te var ama güvence
        return;
      }

      const { data, error } = await supabase
        .from("drawings")
        .select("id, data")
        .eq("user_id", user.id) // Varsayım: Her kullanıcının kendi çizimi var
                               // Ya da paylaşılan bir çizim ID'si kullanılmalı
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
        console.error("Error fetching drawing:", error);
      }

      if (data) {
        setDrawingId(data.id);
        setLines(data.data || []);
      } else {
        // Çizim bulunamazsa yeni bir tane oluştur
        const { data: newData, error: newError } = await supabase
          .from("drawings")
          .insert([{ user_id: user.id, data: [] }])
          .select()
          .single(); // Tek bir kayıt eklendiğinden emin olalım

        if (newError) {
          console.error("Error creating drawing:", newError);
          return;
        }
        if (newData) {
          setDrawingId(newData.id);
          setLines([]);
        }
      }
    };

    fetchDrawingData();
  }, [navigate]); // user.id değişirse yeniden fetch edebilir, ancak user oturumu genellikle sabit

  // Supabase çizim kanalı için useEffect
  useEffect(() => {
    if (!drawingId) return;

    const channel = supabase.channel(`drawing:${drawingId}`);
    channel
      .on("broadcast", { event: "draw" }, ({ payload }) => {
        setLines((prevLines) => [...prevLines, payload.line]);
      })
      .on("broadcast", { event: "clear" }, () => {
        setLines([]);
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "drawings", filter: `id=eq.${drawingId}` },
        (payload) => {
          if (payload.eventType === "UPDATE" && payload.new) {
            setLines((payload.new as { data: Line[] }).data || []);
          }
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED" && userProfile) {
          channel.send({
            type: "broadcast",
            event: "join",
            payload: { message: `${userProfile.username} has joined` },
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [drawingId, userProfile?.username]); // userProfile.username join mesajı için

  // Multi-user draw bildirimi için timeout
  useEffect(() => {
    if (multiUserDraw) {
      const timer = setTimeout(() => setMultiUserDraw(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [multiUserDraw]);

  // Canvas render ve yeniden boyutlandırma
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Yeniden boyutlandırmadan sonra her şeyi tekrar çiz
        ctx.fillStyle = "#ffffff"; // Arka plan rengi
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lines.forEach((line) => draw(ctx, line));
        if (currentShape) {
          draw(ctx, currentShape);
        }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff"; // Arka plan rengi
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      lines.forEach((line) => draw(ctx, line));
      if (currentShape) {
        draw(ctx, currentShape);
      }
    };
    
    resizeCanvas(); // İlk render ve boyutlandırma
    render(); // Çizgileri çiz

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [lines, draw, currentShape]); // draw bağımlılığını ekledik


  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);

    const newLine: Line = {
      points: [{ x, y }],
      color: color,
      size: size,
      tool: tool,
    };

    if (tool === "circle" || tool === "square") {
      setCurrentShape(newLine);
    } else {
      // Pen, brush, eraser için hemen lines'a ekle
      setLines((prevLines) => [...prevLines, newLine]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "circle" || tool === "square") {
      setCurrentShape((prevShape) => {
        if (!prevShape) return null;
        // Başlangıç noktasını koru, ikinci noktayı güncelle
        return { ...prevShape, points: [prevShape.points[0], { x, y }] };
      });
    } else {
      // Pen, brush, eraser için son çizgiyi güncelle
      setLines((prevLines) => {
        if (prevLines.length === 0) return prevLines;
        const lastLine = { ...prevLines[prevLines.length - 1] };
        lastLine.points = [...lastLine.points, { x, y }];
        return [...prevLines.slice(0, -1), lastLine];
      });
    }
  };

  const updateDrawingData = async (newLines: Line[]) => {
    if (!drawingId) {
      console.warn("Drawing ID is not set. Cannot update drawing data.");
      return;
    }
    const { error } = await supabase
      .from("drawings")
      .update({ data: newLines })
      .eq("id", drawingId);

    if (error) {
      console.error("Error updating drawing:", error);
    }
  };
  
  const handlePointerUp = async () => {
    setIsDrawing(false);
  
    let lineToBroadcast: Line | null = null;
    let finalLinesForDB = lines; // Varsayılan olarak mevcut lines
  
    if (currentShape) {
      // Şekil tamamlandı, points dizisinde en az 2 nokta olmalı (başlangıç ve bitiş)
      if (currentShape.points.length >= 2) {
        finalLinesForDB = [...lines, currentShape];
        setLines(finalLinesForDB); // State'i güncelle
        lineToBroadcast = currentShape;
      }
      setCurrentShape(null); // Mevcut şekil işlemini bitir
    } else if (tool === "pen" || tool === "brush" || tool === "eraser") {
      // Pen, brush, eraser için son çizgi lines'ın sonuncusudur.
      if (lines.length > 0) {
        lineToBroadcast = lines[lines.length - 1];
        // finalLinesForDB zaten lines olduğu için tekrar set etmeye gerek yok
      }
    }
  
    // Sadece bir değişiklik olduysa veritabanını güncelle
    if (lineToBroadcast) { // lineToBroadcast varsa, ya yeni bir şekil eklendi ya da bir çizgi tamamlandı.
      updateDrawingData(finalLinesForDB); // DB'yi güncel tam listeyle güncelle
  
      if (drawingId) {
        const { error: broadcastError } = await supabase
          .channel(`drawing:${drawingId}`)
          .send({
            type: "broadcast",
            event: "draw",
            payload: { line: lineToBroadcast }, // Sadece son işlenen çizgiyi yayınla
          });
        if (broadcastError) {
          console.error("Error in broadcast:", broadcastError);
        }
      }
    }
  };


  const clearCanvas = async () => {
    setLines([]);
    updateDrawingData([]); // DB'yi boş array ile güncelle

    if (!drawingId) {
      console.warn("Drawing ID is not set. Cannot broadcast clear event.");
      return;
    }
    const { error: broadcastError } = await supabase
      .channel(`drawing:${drawingId}`)
      .send({ type: "broadcast", event: "clear" });

    if (broadcastError) {
      console.error("Error broadcasting clear:", broadcastError);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {multiUserDraw && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          Çoklu çizim etkinleştirildi!
        </div>
      )}

      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-lg"
        >
          {userProfile &&
            generateUserAvatar(userProfile.username, userProfile.email)}
          <span className="font-medium hidden md:inline">
            {userProfile?.username}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  {userProfile &&
                    generateUserAvatar(userProfile.username, userProfile.email)}
                  <div>
                    <h3 className="font-medium">
                      {userProfile?.username || "Kullanıcı"}
                    </h3>
                    <p className="text-sm text-gray-500">{userProfile?.email}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-full py-2 px-3 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış Yap
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="touch-none bg-white" // Arka plan rengi burada da verilebilir
        style={{ touchAction: "none" }}
      />

      {/* Toolbar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-2 border border-gray-200/50">
        <div className="flex gap-1"> {/* Gap biraz azaltıldı */}
          <Tooltip text="Kalem">
            <Button
              variant={tool === "pen" ? "default" : "ghost"}
              onClick={() => setTool("pen")}
              size="icon" // TS hatası olmaması için ButtonProps'a eklendi
              className={tool === "pen" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}
            >
              <Pencil className="h-5 w-5" /> {/* İkon boyutu biraz büyütüldü */}
            </Button>
          </Tooltip>
          <Tooltip text="Fırça">
            <Button
              variant={tool === "brush" ? "default" : "ghost"}
              onClick={() => setTool("brush")}
              size="icon"
              className={tool === "brush" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}
            >
              <Brush className="h-5 w-5" />
            </Button>
          </Tooltip>
          <Tooltip text="Silgi">
            <Button
              variant={tool === "eraser" ? "default" : "ghost"}
              onClick={() => setTool("eraser")}
              size="icon"
              className={tool === "eraser" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}
            >
              <Eraser className="h-5 w-5" />
            </Button>
          </Tooltip>
          <Tooltip text="Daire">
            <Button
              variant={tool === "circle" ? "default" : "ghost"}
              onClick={() => setTool("circle")}
              size="icon"
              className={tool === "circle" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}
            >
              <Circle className="h-5 w-5" />
            </Button>
          </Tooltip>
          <Tooltip text="Kare">
            <Button
              variant={tool === "square" ? "default" : "ghost"}
              onClick={() => setTool("square")}
              size="icon"
              className={tool === "square" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}
            >
              <Square className="h-5 w-5" />
            </Button>
          </Tooltip>

          <div className="border-r border-gray-300 h-6 self-center mx-1"></div>

          <Tooltip text="Temizle">
            <Button variant="ghost" onClick={clearCanvas} size="icon" className="hover:bg-red-100 hover:text-red-700">
              <Trash2 className="h-5 w-5" />
            </Button>
          </Tooltip>

          <div className="relative">
            <Tooltip text="Renk Seç">
              <Button variant="ghost" onClick={() => setShowPalette(!showPalette)} size="icon" className="hover:bg-gray-100">
                <Palette className="h-5 w-5" />
              </Button>
            </Tooltip>
            <AnimatePresence>
              {showPalette && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.1 }}
                  className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-md p-2 z-20 min-w-[160px] border border-gray-200/50"
                >
                  <div className="grid grid-cols-4 gap-2">
                    {availableColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setColor(c);
                          setShowPalette(false);
                        }}
                        className={`w-6 h-6 rounded-full hover:ring-2 hover:ring-offset-2 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 ${color === c ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:ring-gray-400'}`}
                        style={{
                          backgroundColor: c,
                          border: c === "#FFFFFF" ? "1px solid #E5E7EB" : "none",
                        }}
                        aria-label={`Renk ${c}`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;