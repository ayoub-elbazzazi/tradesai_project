const TOKEN = "7590884818:AAHOsX6A6chez851mInQ-SI8yTVwDIIu-Fw"; // Votre jeton de bot Telegram
const WEBHOOK = '/endpoint'; // Le point de terminaison webhook
const SECRET = "test1"; // Clé secrète pour vérifier les requêtes
const BASE_URL = "https://tradesai.ambrcash2.workers.dev"; // Remplacez par l'URL de votre Cloudflare Worker


addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event));
  } else if (url.pathname === '/registerWebhook') {
    event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET));
  } else if (url.pathname === '/unRegisterWebhook') {
    event.respondWith(unRegisterWebhook(event));
  } else if (url.pathname === '/cleanupGroup') {
    event.respondWith(cleanupGroup(event));
  } else {
    event.respondWith(new Response('No handler for this request'));
  }
});



async function fetchCryptoPrices() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,toncoin,trondao,trondoge,dogecoin,pancakeswap-token&vs_currencies=usd');
      const data = await response.json();
      console.log('Crypto Prices:', JSON.stringify(data, null, 2));  // Log the fetched crypto prices
      return data;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return {};  // Return an empty object on error
    }
  }


async function handleWebhook(event) {
  // Check secret
  if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== SECRET) {
    return new Response('Unauthorized', { status: 403 });
  }

  // Read request body synchronously
  const update = await event.request.json();
  // Deal with response asynchronously
  event.waitUntil(onUpdate(update));

  return new Response('Ok');
}


async function registerWebhook(event, url, WEBHOOK, SECRET) {
  const webhookUrl = `${BASE_URL}${WEBHOOK}`;
  const telegramUrl = `https://api.telegram.org/bot${TOKEN}/setWebhook`;

  const response = await fetch(telegramUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: SECRET
    })
  });

  if (response.ok) {
    return new Response('Webhook registered successfully', { status: 200 });
  } else {
    return new Response('Failed to register webhook', { status: 500 });
  }
}


async function unRegisterWebhook(event) {
  const telegramUrl = `https://api.telegram.org/bot${TOKEN}/deleteWebhook`;

  const response = await fetch(telegramUrl, {
    method: 'POST'
  });

  if (response.ok) {
    return new Response('Webhook unregistered successfully', { status: 200 });
  } else {
    return new Response('Failed to unregister webhook', { status: 500 });
  }
}


async function cleanupGroup(event) {
  // Ajoutez ici votre logique de nettoyage spécifique au groupe
  // Par exemple, suppression de messages, gestion des membres, etc.
  return new Response('Group cleanup completed', { status: 200 });
}


async function onUpdate(update) {
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    if (text === '/start') {
      await sendWelcomeMessage(chatId);
    }
  } else if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
  }
}

async function sendWelcomeMessage(chatId) {
    const message = {
      chat_id: chatId,
      text: `
      🌟 🌟 We provide daily signals across all asset classes, including currencies, commodities, indices, cryptocurrencies, and metals. Our signals offer a win rate of 75-100%, with a strong risk-to-reward ratio based on market conditions, asset class, and timeframe. We are committed to continuously improving signal quality 🌟\n\n🔝 Stay updated on the latest happenings and discover a wide range of options available to you: 🌟\n\n🔝 Stay updated on the latest happenings and discover a wide range of options available to you:
      `,
      reply_markup: {
        inline_keyboard: [ 
          [{ text: "📺 Channel", callback_data: "option_channelsEng" }, { text: "👥 Communities", callback_data: "option_communities1" }],
          [{ text: "✍️ Learn About Strategic Trades with TradesAI_Australia", callback_data: "option_payCrypto" }],
          [{ text: "✍️ Review 📸", callback_data: "reviews1" }],
          [{ text: "📨 Chat With a Humain Support Agent 📬", callback_data: "option_test1" }]
        ]
      }
    };

  await sendTelegramMessage(message);
}


const userStates = {};

async function handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    let messageText;
    let markup;

    // Initialiser ou récupérer l'état de l'utilisateur
    if (!userStates[chatId]) {
        userStates[chatId] = { language: 0 };
    }

    else if (data === 'return_to_main') {
      const language = userStates[chatId].language;
      sendWelcomeMessage(chatId);
  } else if (data === 'return_to_main1') {
    
    markup = {
      inline_keyboard: [
        [{ text: "TradesAI_Australia Special Offers ", callback_data: "special" }],
        [{ text: "How  Can I access TradesAI_Australia", callback_data: "access" }],
        [{ text: "What Do I get With TradesAI_Australia Elite Indicator", callback_data: "indicator" }],
        [{ text: "What Do I get With TradesAI_Australia Signals", callback_data: "signals" }],
        [{ text: "What Do I Need To Know About  TradesAI_Australia VIP Signals", callback_data: "vip" }],
        [{ text: "Do I place my orders manually ", callback_data: "orders" }],
        [{ text: "Are TradesAI signals coming in late or delayed? ", callback_data: "delayed" }],
        [{ text: "Why are TradesAI_Australia paid plans better  ", callback_data: "better" }],
        [{ text: " Can I use TradesAI on (MT4 or MT5)? ", callback_data: "mt45" }],
        [{ text: " Is TP1, the first target of the signal profitable? ", callback_data: "tp1" }],
        [{ text: "How Can i pay for the premium plans", callback_data: "premium" }],
        [{ text: "Return", callback_data: "return_to_main1" }]
      ]
  };
  messageText = `<b>🔍 Explore our services and get the answers to your questions about TradesAI_Australia   :
  
🌟 Discover our special offers   
🔑 Learn how to access TradesAI_Australia
📈 Understand the benefits of our Elite Indicator
📊 Find out what you get with our signals
🚀 Learn about our VIP signals
🛠️ Get details on manual order placement
⏳ Understand signal delivery times
💡 See why our paid plans offer more value
⚙️ Check if TradesAI works with MT4 or MT5
📉 Find out about the profitability of TP1
💳 Learn about payment options for premium plans <b>
  
If you need further assistance, just let us know! 
<b>Tradesai.net</b>  `;




    
} else if (data === 'option_channelsEng') {
        markup = {
            inline_keyboard: [
                [{ text: "Visit our channel", url: "https://t.me/TradesAI_Australia" }],
                [{ text: "Return", callback_data: "return_to_main" }]
            ]
        };
        messageText = "🌟     Check out our channel tradesAI_australia for more information and updates!    🌟\n<b>Tradesai.net</b>";
    } else if (data === 'reviews1') {
        markup = {
            inline_keyboard: [
                [{ text: "TradesAI_Australia Reviews", url: "" }],
                [{ text: "Return", callback_data: "return_to_main" }]
            ]
        };
        messageText = "📢 Check Out Our Reviews!\n\n🌟 See what others are saying and get an insight into their experiences with our group.\n  <b>Tradesai.net</b>";
    } else if (data === 'option_communities1') {
        markup = {
            inline_keyboard: [
                [{ text: "Return", callback_data: "return_to_main" }]
            ]
        };
        messageText = "Welcome to the TradesAI_Australia Group! 🎉\n\nThank you for joining us! Connect with fellow traders, share insights, and stay updated with the latest TradesAI_Australia  in Australia. 🔝\n <b>Tradesai.net</b>";
    }  else if (data === 'feedback_1') {
        markup = {
            inline_keyboard: [
                [{ text: "🌟🌟🌟🌟🌟", callback_data: "feedback1" }],
                [{ text: "🌟🌟🌟🌟", callback_data: "feedback2" }],
                [{ text: "🌟🌟🌟", callback_data: "feedback3" }],
                [{ text: "🌟🌟", callback_data: "feedback4" }]
            ]
        };
        messageText = "⭐️ Please choose how many stars you want to give for the quality of the service. ";
    }else if (data === 'feedback1') {
        markup = {
            inline_keyboard: [
                [{ text: "Return", callback_data: "return_to_main" }]
            ]
        };
        messageText = "🌟🌟🌟🌟🌟";
    }  else if (data === 'feedback2') {
        markup = {
            inline_keyboard: [
                [{ text: "Return", callback_data: "return_to_main" }]
                
            ]
        };
        messageText = "🌟🌟🌟🌟";
    }  else if (data === 'feedback3') {
        markup = {
            inline_keyboard: [
                [{ text: "Return", callback_data: "return_to_main" }]
            ]
        };
        messageText = "🌟🌟🌟";
    }  else if (data === 'feedback4') {
        markup = {
            inline_keyboard: [
                [{ text: "Return", callback_data: "return_to_main" }]
            ]
        };
        messageText = "🌟🌟";
    }  
    else if (data === 'option_test1') {
        markup = {
            inline_keyboard: [
                [{ text: "📨 Contact the manager 📬", url: "https://t.me/FunnyBunny125"  }],
                [{ text: "Return", callback_data: "return_to_main" }]
            ]
        };
        messageText = `🙋‍♂ Hi there!\n\n💁‍♂ You’ve reached the manager contact section. How can we assist you? We’re happy to help.
        <b>Tradesai.net</b>`;
    } else if (data === 'option_payCrypto1') {
        markup = {
            inline_keyboard: [
                [{ text: "🔗 Go to @CryptoBot", url: "https://t.me/CryptoBot"  }],
                [{ text: "Return ", callback_data: "return_to_main" }]
            ]  

          };
          messageText = `💳 Ready to make a transaction? Tap the button below to proceed with @CryptoBot!
          <b>Tradesai.net</b>`;

      }  else if (data === 'signals') {
        markup = {
            inline_keyboard: [
                
                [{ text: "Return ", callback_data: "return_to_main1" }]
            ]  

          };
          messageText = `
 📡 <b> Access to 5 Exclusive Channels           
Get signals for +14 assets across all asset classes:</b>
          
💱 Currencies    
🛢 Commodities    
📈 Indices    
💰 Cryptocurrencies    
🏅 Metals    
🎯 Unlimited Signals: No daily limits per asset.
🎯 5 Targets: Precise targets for optimal trades.
⏳ High & Low Timeframes: Multiple signals for varying strategies.
🔗 Live Tracking: Stay on top of every signal in real-time.
📊 Chart Analysis: Comprehensive analysis for better decision-making.    
          
💡 Exclusive Content & VIP Access:
       Join our VIP community of top traders and access educational materials tailored to your success.    
          
🛠 24/7 Support: Always here to help, anytime you need it.
<b>Tradesai.net</b>`;

      }  else if (data === 'indicator') {
        markup = {
            inline_keyboard: [
                
                [{ text: "Return ", callback_data: "return_to_main1" }]
            ]  

          };
          messageText = `<b>🚀     TRADESAI ELITE INDICATOR MEMBERSHIP    
               Unlock exclusive trading tools to elevate your strategy    :
          
          📊     Market Structure Break Levels (MSBs)    : Pinpoint key breakpoints in the market.
          🔄     Proprietary Reversal Order Blocks (ROBs)    : Identify high-quality reversal opportunities.
          🧱     Order Blocks (OBs)    : Spot the most reliable entry and exit zones.
          📈     Auto-Drawn Trendlines (TLs)    : Trendlines drawn automatically for streamlined analysis.
          💼     Versatile Application    : Works seamlessly with all assets and all timeframes.
          
          💡     VIP Access    : Join our educational community of top traders.
          
          🛠     24/7 Support    : Always available for your trading needs.  </b>  
          <b>Tradesai.net</b> `;
         
      }  else if (data === 'access') {
        markup = {
            inline_keyboard: [
                
                [{ text: "Return ", callback_data: "return_to_main1" }]
            ]  

          };
          messageText = `<b>📝     How to Get Started    
          1️⃣ Visit Our Website    :
          https://www.tradesai.net/
          Head over to our site and select the membership plan that fits your needs.
          
          2️⃣     Gain Instant Access:    
          After completing your purchase, follow the instructions, and you'll get immediate access.</b>
          <b>Tradesai.net</b>
          `;
          
      } 
       
    else if (data === 'delayed') {
      markup = {
          inline_keyboard: [
              [{ text: "Return", callback_data: "return_to_main1" }]
          ]
      };
      messageText = `  <b>  
      🚫 Absolutely not, the signals are completely valid and active.   

      🕑 Remember   : As long as you haven't received any follow-up TP (Take Profit) hit messages, the signal remains valid, even after several hours or days.
      
      🔍 What matters is not where the price is when you receive the signal, even if it moves beyond all TPs — that’s irrelevant.
      
      📈 Here's what to do: 1️⃣     Place a Limit (Pending) Order at the entry zone.    2️⃣     Set your Stop Loss (SL) and desired Take Profit (TP) levels   . 3️⃣     Then, simply wait for the price to pull back to your entry point. Once it does, your order will be executed.  </b> `;
  }   else if (data === 'premium') {
      markup = {
          inline_keyboard: [
              
              [{ text: "Return ", callback_data: "return_to_main1" }]
          ]  

        };
        messageText = `
        <b>TradesAI_Australia</b> offers multiple options to assist you in making payments effortlessly, whether through fiat using debit/credit cards or through cryptocurrencies.

        Click here for more information: 
        <b>Tradesai.net</b> `;
        
    }  else if (data === 'better') {
      markup = {
          inline_keyboard: [
              
              [{ text: "Return ", callback_data: "return_to_main1" }]
          ]  

        };
        messageText = `  <b>  
        ⚡️ TradesAI_Australia Premium Indicators    are currently exclusive to     TradingView   , a powerful, free web-based charting platform.

        🖥️ You can use     TradingView    for analysis, but you’re free to execute your trades on any platform based on the signals and charts provided.
        
        💡 Plus, we’re working on adding support for     alternative platforms    soon! Stay tuned for updates.<b>
        <b>Tradesai.net</b>`;

    }  else if (data === 'mt45') {
      markup = {
          inline_keyboard: [
              
              [{ text: "Return ", callback_data: "return_to_main1" }]
          ]  

        };
        messageText = `<b>
        ✨ What makes "TradesAI_Australia" truly incredible is its Premium tools. These offer deeper customization, unique features, and comprehensive toolkits crafted from years of user feedback.

        📊 Our tools are designed to enhance your charts and trading experience, making it easier to spot opportunities and act confidently.
        
        🚀 We believe these indicators and signals are superior, simplifying the trading process so you can trade with more clarity and confidence.</b>
        <b>Tradesai.net</b>`;

    }else if (data === 'tp1') {
      markup = {
          inline_keyboard: [
              
              [{ text: "Return ", callback_data: "return_to_main1" }]
          ]  

        };
        messageText = `<b>
        ⚠️    Special Case Alert   

        In certain situations, the first target may be close to your entry because we set stop loss orders nearby to prevent significant losses. We also adjust Take Profit (TP) levels accordingly to maintain a fixed risk-to-reward ratio. You might have opened your position in a lower timeframe zone, which can influence this.
        
        💼     Additionally    , if you're using a platform with high fees or your broker has a wide spread, consider adjusting your position. You could close at a higher target or use the first target to secure your position by setting a Stop Loss at breakeven, if it aligns with your chart analysis.
        
        📈     Pro Tip    If managing positions feels tricky, we recommend following our higher timeframe signals, which are profitable even at the first target. For an even better experience, consider purchasing our Ultimate Bundle. This includes access to our     Elite Indicator    , which highlights buy and sell zones with precision, helping you make more informed decisions about signals and optimizing your trading journey.</b>
        <b>Tradesai.net</b>`;

    } else if (data === 'special') {
      markup = {
          inline_keyboard: [
              
              [{ text: "Return ", callback_data: "return_to_main1" }]
          ]  

        };
        messageText = `
        📊 Daily Signals for All Asset Classes:   

        We provide daily signals across all asset classes, including:
        
        Currencies 💱
        Commodities 🛢️
        Indices 📈
        Cryptocurrencies ₿
        Metals 🏅   
        ✨ Our signals boast a win rate of 75-100%, depending on:
        
        Market conditions 📊
        Asset class 📑
        Timeframe 🕒   
        ⚙️ We are committed to continuously improving the quality of our signals to give you the best trading experience.
        <b>Tradesai.net</b> `;

    } else if (data === 'option_payCrypto') {
      markup = {
          inline_keyboard: [
            [{ text: "TradesAI_Australia Special Offers ", callback_data: "special" }],
            [{ text: "How  Can I access TradesAI_Australia", callback_data: "access" }],
            [{ text: "What Do I get With TradesAI_Australia Elite Indicator", callback_data: "indicator" }],
            [{ text: "What Do I get With TradesAI_Australia Signals", callback_data: "signals" }],
            [{ text: "What Do I Need To Know About  TradesAI_Australia VIP Signals", callback_data: "vip" }],
            [{ text: "Do I place my orders manually ", callback_data: "orders" }],
            [{ text: "Are TradesAI signals coming in late or delayed? ", callback_data: "delayed" }],
            [{ text: "Why are TradesAI_Australia paid plans better  ", callback_data: "better" }],
            [{ text: " Can I use TradesAI on (MT4 or MT5)? ", callback_data: "mt45" }],
            [{ text: " Is TP1, the first target of the signal profitable? ", callback_data: "tp1" }],
            [{ text: "How Can i pay for the premium plans", callback_data: "premium" }],
            [{ text: "Return", callback_data: "return_to_main" }]
          ]
      };
      messageText = `🔍 Explore our services and get the answers to your questions about TradesAI_Australia   :
      
🌟     Discover our special offers   
🔑 Learn how to access TradesAI_Australia
📈 Understand the benefits of our Elite Indicator
📊 Find out what you get with our signals
🚀 Learn about our VIP signals
🛠️ Get details on manual order placement
⏳ Understand signal delivery times
💡 See why our paid plans offer more value
⚙️ Check if TradesAI works with MT4 or MT5
📉 Find out about the profitability of TP1
💳 Learn about payment options for premium plans
      
If you need further assistance, just let us know!   `;
  } 



 


    await sendTelegramMessage({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
        reply_markup: markup
    });
    
}

  
  
  
  
  
  

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  });
}
