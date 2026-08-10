import axios from 'axios';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getLocalSmartResponse = (msg) => {
    const text = msg.toLowerCase().trim();

    // 1. Specific Service Search & Hiring Intents (cook, maid, babysitter, etc.)
    if (text.includes("cook") || text.includes("khana") || text.includes("chef") || text.includes("rasoi")) {
        return "Aapko Cook (Khana banane wale) chahiye? 🍳\nAap top menu me 'Find Help' page par ja kar 'Cook' filter select karke verified cooks ki profiles dekh sakte hain aur unke saath interview book kar sakte hain.";
    }
    if (text.includes("maid") || text.includes("kamwali") || text.includes("safai") || text.includes("cleaning") || text.includes("sweeper")) {
        return "Aapko Househelp / Maid (Safai & Gharelu kaam) chahiye? 🧹\n'Find Help' page par 'Maid / Housekeeping' filter select karein aur apne city ke verified helpers browse karein.";
    }
    if (text.includes("babysitter") || text.includes("nanny") || text.includes("bachhe") || text.includes("baby") || text.includes("child")) {
        return "Aapko Babysitter / Nanny (Bacho ki dekhbhal) chahiye? 👶\n'Find Help' page par 'Babysitter' category select karke trained and verified nannies book kar sakte hain.";
    }
    if (text.includes("elderly") || text.includes("care") || text.includes("bujurg") || text.includes("patient") || text.includes("senior")) {
        return "Aapko Elderly Care / Patient Caretaker chahiye? 👴\n'Find Help' page par 'Elderly Care' filter select karke experienced caretakers book karein.";
    }
    if (text.includes("book") || text.includes("hire") || text.includes("chahiye") || text.includes("dhoondh") || text.includes("need")) {
        return "HelpHive par kisi bhi Helper (Cook, Maid, Nanny) ko book karne ke liye 'Find Help' page par jayein. Unki profile par 'Book Helper / Interview' button dabayein!";
    }

    // 2. Pricing & Salary Intents
    if (text.includes("price") || text.includes("rate") || text.includes("fee") || text.includes("charge") || text.includes("paise") || text.includes("salary") || text.includes("kitna")) {
        return "HelpHive par sabhi helpers ki rates unki profile par clearly mentioned hain (e.g. ₹500/hour ya monthly rate). Aap interview ke dauran exact pricing negotiate bhi kar sakte hain.";
    }

    // 3. Worker Registration Intents
    if (text.includes("register") || text.includes("job") || text.includes("worker") || text.includes("work") || text.includes("kaam karna")) {
        return "Agar aap ek domestic professional (Cook, Maid, Driver) hain aur kaam dhoondh rahe hain, to top bar me 'Join as a Professional' ya '/worker-signup' par ja kar apni profile bana sakte hain.";
    }

    // 4. Cancellation & Refund Intents
    if (text.includes("cancel") || text.includes("terminate") || text.includes("refund")) {
        return "Aap apne Dashboard ('My Sent Requests') me ja kar active bookings ko 'Terminate Contract' kar sakte hain. Contract terminate hone par worker instantly release ho jata hai.";
    }

    // 5. Greeting Intents (Regex Word Boundary check to prevent false substring matches like 'c-h-a-h-i-y-e')
    if (/\b(hi|hello|hey|kaise ho|kaisde ho|namaste)\b/i.test(text) || text === 'hi' || text === 'hello') {
        return "Hello! Main HelpHive AI Assistant hoon. Main badhiya hoon! Aapki kya sahayata kar sakta hoon? Aap yahan Cooks, Maids, Babysitters book kar sakte hain ya worker ke roop me register ho sakte hain.";
    }

    return "Thank you for reaching out! Main HelpHive Assistant hoon. Aap 'Find Help' page par verified maids, cooks, babysitters search kar sakte hain aur unhe direct book kar sakte hain. Koi aur sawaal hai to batayein!";
};

const queryChatbot = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message content is required");
    }

    const googleApiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    // If API key is missing or blank, respond with smart platform assistant fallback
    if (!googleApiKey || googleApiKey.trim() === '') {
        const fallbackReply = getLocalSmartResponse(message);
        return res.status(200).json(new ApiResponse(200, { reply: fallbackReply }, "Query successful"));
    }

    const systemPrompt = `You are "HelpHive Assistant," a friendly and helpful AI assistant for the HelpHive platform. Your goal is to assist users looking for or offering domestic help services like maids, cooks, and babysitters.
- Be polite, concise, and professional.
- If you don't know an answer, say so. Do not make up information about pricing or specific helpers.
- Gently guide users to use the website's features (e.g., "You can find verified helpers by using the filters on the 'Find Help' page.").
- Your knowledge is based on the platform's public information. You cannot access user accounts or booking details.`;

    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleApiKey}`;

    try {
        const response = await axios.post(
            apiEndpoint,
            {
                contents: [
                    { parts: [ { text: systemPrompt } ] },
                    { parts: [ { text: "Okay, I understand. I am the HelpHive Assistant." } ], role: "model" },
                    { parts: [ { text: message } ] }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 512,
                }
            }
        );

        const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!botReply) {
             const fallbackReply = getLocalSmartResponse(message);
             return res.status(200).json(new ApiResponse(200, { reply: fallbackReply }, "Query successful"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, { reply: botReply }, "Query successful"));

    } catch (error) {
        console.error("Error calling Google Gemini AI:", error.response?.data || error.message);
        const fallbackReply = getLocalSmartResponse(message);
        return res.status(200).json(new ApiResponse(200, { reply: fallbackReply }, "Query successful"));
    }
});

export { queryChatbot };