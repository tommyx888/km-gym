import type { LegalContent } from './types';
import { site } from '../site';

const o = site.operator;
const email = site.contact.email || 'info@kmgym.sk';
const phone = site.contact.phone;
const person = site.contact.person;
const gym = `${site.contact.address.street}, ${site.contact.address.zip} ${site.contact.address.city}`;
const operator = `${o.name}, so sídlom ${o.street}, ${o.zip} ${o.city}, IČO: ${o.ico}, DIČ: ${o.dic}, IČ DPH: ${o.icdph}, zapísaná v Obchodnom registri Mestského súdu Bratislava III`;
const L = site.legal;

export const sk: LegalContent = {
  /* ------------------------------------------------------------------ VOP */
  terms: {
    title: 'Členské a obchodné podmienky',
    lead: `Podmienky kúpy a využívania členstva a vstupov do fitness centra KM GYM. Prevádzkovateľ: ${o.name}. Dátum vyhotovenia: 26. október 2026.`,
    sections: [
      {
        h: '1. Identifikácia prevádzkovateľa',
        ul: [
          `Obchodné meno: ${o.name}`,
          `Sídlo: ${o.street}, ${o.zip} ${o.city}`,
          `IČO: ${o.ico.replace(/\s/g, '')} | DIČ: ${o.dic} | IČ DPH: ${o.icdph}`,
          `Prevádzka: KM GYM, ${gym}`,
          `Kontaktná osoba: ${person}`,
          `E‑mail: ${email} | Telefón: ${phone}`,
          'Webová stránka: https://www.kmgym.sk/sk',
        ],
        p: ['V týchto podmienkach sa West road s.r.o. označuje ako „prevádzkovateľ“ a osoba, ktorá si kúpi alebo využíva službu KM GYM, ako „zákazník“.'],
      },
      {
        h: '2. Rozsah a uzatvorenie zmluvy',
        p: [
          'Tieto podmienky upravujú kúpu a využívanie členstva a vstupov do fitness centra KM GYM. Pred nákupom má zákazník k dispozícii informácie o zvolenej službe, cene, dobe platnosti a spôsobe prístupu.',
          'Zmluva sa uzatvára objednaním konkrétnej služby a jej zaplatením alebo potvrdením iného prevádzkovateľom povoleného spôsobu úhrady. Pri online objednávke musí byť pred odoslaním objednávky zrozumiteľne uvedená celková cena a skutočnosť, že objednávka zakladá povinnosť zaplatiť.',
          'Zákazník je povinný uviesť pravdivé a aktuálne údaje. Potvrdenie objednávky a informácie o zakúpenej službe sa poskytujú prostredníctvom systému, e‑mailu alebo iným vhodným elektronickým spôsobom.',
        ],
      },
      {
        h: '3. Členstvo, ceny a platnosť',
        p: ['Základný cenník KM GYM:'],
        ul: [
          'Bežné mesačné členstvo: 39 €.',
          'Zvýhodnené mesačné členstvo pre študentov do 19 rokov: 32 €.',
          'Zvýhodnené mesačné členstvo pre seniorov: 32 €.',
          'Jednorazový vstup: 5 €.',
          'Jednorazový vstup pre študenta: 3 €.',
          'Balík 10 vstupov: 45 €.',
          'Trojmesačné členstvo: 109 €.',
          'Ročné členstvo: 429 €.',
        ],
      },
      {
        h: '',
        p: [
          'Rozhodujúca je cena a rozsah produktu zobrazené zákazníkovi pred potvrdením konkrétneho nákupu. Zvýhodnenú cenu môže prevádzkovateľ podmieniť preukázaním nároku. Ak sa cena alebo ponuka zmení, zmena sa nevzťahuje spätne na už zaplatenú službu.',
          'Ak pri konkrétnom produkte nie je pred nákupom výslovne uvedené inak, mesačné členstvo platí 30 po sebe nasledujúcich dní od aktivácie. Pri iných produktoch platí doba uvedená pri nákupe. Členstvo je osobné a neprenosné a automaticky sa neobnovuje, ak sa zákazník výslovne nedohodne inak.',
          'Nevyužitie členstva z osobných dôvodov samo osebe nezakladá nárok na predĺženie alebo vrátenie ceny. Toto ustanovenie neobmedzuje zákonné práva zákazníka, najmä ak služba nebola poskytnutá alebo bola podstatne obmedzená.',
        ],
      },
      {
        h: '4. Prístup do prevádzky',
        p: [
          'KM GYM je samoobslužné fitness centrum. Prístup je možný v rozsahu a čase uvedenom pri zakúpenej službe a podľa aktuálneho prístupového systému. Ak je zákazníkovi pri konkrétnom členstve potvrdený režim 24/7, môže vstupovať nepretržite s výnimkou oznámených obmedzení alebo mimoriadnych situácií.',
          'PIN, QR kód alebo iný prístupový údaj je osobný a neprenosný. Zákazník ho nesmie poskytnúť inej osobe, zverejniť ani umožniť vstup neoprávnenej osobe. Zakázané je blokovať dvere, obchádzať vstupný systém alebo manipulovať so zámkami a zabezpečovacími prvkami.',
          'Pri poruche vstupného systému alebo nebezpečnej situácii zákazník nesmie obchádzať zabezpečenie a bezodkladne kontaktuje prevádzkovateľa na uvedenom e‑maile alebo telefónnom čísle. Pri bezprostrednom ohrození života alebo zdravia volá 112 alebo 155.',
          'Prevádzkovateľ môže z dôvodu údržby, poruchy, výpadku energií, ohrozenia bezpečnosti, zásahu orgánov verejnej moci alebo inej závažnej okolnosti dočasne obmedziť vstup. Ak je to možné, zákazníkov informuje vopred alebo bez zbytočného odkladu. Nároky zákazníka pri obmedzení služby sa posudzujú podľa rozsahu, trvania a platných právnych predpisov.',
        ],
      },
      {
        h: '5. Pravidlá bezpečného používania',
        ul: [
          'Zákazník používa stroje a pomôcky len na určený účel a primerane svojim schopnostiam a zdravotnému stavu.',
          'Zákazník nesmie používať poškodené zariadenie ani svojvoľne meniť jeho konštrukciu alebo bezpečnostné nastavenia. Poruchu oznámi prevádzkovateľovi.',
          'Závažia, kotúče, adaptéry a pomôcky sa po použití vracajú na určené miesto. Po použití zákazník zanechá zariadenie čisté a pripravené pre ďalšieho návštevníka.',
          'Zákazník nesmie cvičiť pod vplyvom alkoholu, omamných alebo psychotropných látok ani v stave, ktorý zjavne znižuje schopnosť bezpečne trénovať.',
          'Pri bolesti na hrudníku, náhlej dýchavičnosti, závrate, strate koordinácie alebo inom vážnom príznaku zákazník tréning preruší a podľa potreby privolá pomoc.',
          'V priestoroch sa vyžaduje čisté športové oblečenie a vhodná športová obuv. Zákazník dodržiava hygienické pokyny a pravidlá používania šatní a sociálnych zariadení.',
          'Je zakázané fajčiť, poškodzovať vybavenie, obťažovať ostatných, vyvolávať konflikty alebo vykonávať činnosť ohrozujúcu bezpečnosť či neprimerane obmedzujúcu ostatných členov.',
          'Zákazník nesmie fotografovať ani nahrávať iné osoby spôsobom zasahujúcim do ich súkromia alebo práv bez príslušného právneho dôvodu.',
        ],
        p: ['KM GYM neposkytuje zdravotnú diagnostiku ani zdravotnú starostlivosť. Zákazník s pochybnosťami o vhodnosti cvičenia alebo so zdravotným obmedzením sa má poradiť so zdravotníckym odborníkom. Tieto podmienky nevylučujú zákonné povinnosti prevádzkovateľa ani jeho zodpovednosť v rozsahu, v akom ju nemožno podľa zákona vylúčiť.'],
      },
      {
        h: '6. Maloleté osoby',
        p: [
          'Osoby mladšie ako 15 rokov môžu využívať fitness priestory len v sprievode zodpovednej dospelej osoby. Osoby vo veku 15 až 17 rokov môžu vstupovať samostatne len po predložení písomného súhlasu zákonného zástupcu a schválení prevádzkovateľom.',
          'Maloletým nie je povolený samostatný vstup v čase od 22:00 do 06:00. Prevádzkovateľ môže overiť vek a súhlas zákonného zástupcu. Maloletí nesmú obchádzať obmedzenia vstupnej aplikácie alebo používať prístupové údaje iných osôb.',
        ],
      },
      {
        h: '7. Škoda, úraz a porušenie podmienok',
        p: [
          'Zákazník zodpovedá za škodu, ktorú spôsobí porušením svojich zákonných alebo zmluvných povinností, podľa platných právnych predpisov. Úraz, poškodenie vybavenia alebo nebezpečnú situáciu oznámi bezodkladne prevádzkovateľovi.',
          'Pri dôvodnom podozrení na zdieľanie prístupového kódu, ohrozovanie bezpečnosti, poškodzovanie majetku alebo závažné porušenie týchto podmienok môže prevádzkovateľ primerane a dočasne pozastaviť prístup. Ak je to možné, zákazník bude informovaný o dôvode a ďalšom postupe. Pri závažnom alebo opakovanom porušení môže prevádzkovateľ členstvo ukončiť v súlade s právnymi predpismi.',
          'Tieto podmienky nezavádzajú zmluvnú pokutu za porušenie pravidiel. Prevádzkovateľ si môže uplatniť náhradu škody, ak na ňu vznikne nárok podľa zákona.',
        ],
      },
      {
        h: '8. Odstúpenie od zmluvy pri nákupe na diaľku',
        p: [
          `Ak zákazník – spotrebiteľ uzavrie zmluvu na diaľku, má spravidla právo odstúpiť od zmluvy bez uvedenia dôvodu do 14 dní odo dňa jej uzavretia, pokiaľ sa na konkrétnu službu nevzťahuje zákonná výnimka. Odstúpenie možno zaslať jednoznačným vyhlásením na ${email} alebo poštou na adresu ${o.name}, ${o.street}, ${o.zip} ${o.city}. Vzorový formulár je dostupný v sekcii Dokumenty.`,
          'Ak spotrebiteľ výslovne požiada o začatie poskytovania služby pred uplynutím lehoty na odstúpenie, môže byť pri odstúpení povinný zaplatiť pomernú cenu za plnenie poskytnuté do oznámenia odstúpenia, ak sú splnené zákonné podmienky. Ak je služba úplne poskytnutá na základe predchádzajúceho výslovného súhlasu spotrebiteľa a jeho potvrdenia, že berie na vedomie stratu práva na odstúpenie po úplnom poskytnutí, právo na odstúpenie môže zaniknúť v súlade so zákonom.',
          'Všeobecné potvrdenie týchto podmienok nenahrádza osobitnú výslovnú žiadosť alebo súhlas, ak ich právne predpisy vyžadujú. Pri online nákupe musia byť takéto voľby zobrazené samostatne a ich potvrdenie preukázateľne zaznamenané.',
        ],
      },
      {
        h: '9. Reklamácie a podnety',
        p: [
          `Reklamácie, sťažnosti a žiadosti o nápravu možno zaslať na e‑mail ${email} alebo poštou na adresu ${o.name}, ${o.street}, ${o.zip} ${o.city}. Zákazník uvedie kontaktné údaje, opis problému, dátum a doklad o nákupe, ak je k dispozícii. Prevádzkovateľ podanie vybaví v zákonnej lehote. Podrobnosti upravuje Reklamačný poriadok.`,
          'Spotrebiteľ môže využiť mechanizmy alternatívneho riešenia spotrebiteľských sporov podľa platných právnych predpisov Slovenskej republiky (zákon č. 391/2015 Z. z.; subjektom je napr. Slovenská obchodná inšpekcia, www.soi.sk).',
        ],
      },
      {
        h: '10. Ochrana osobných údajov',
        p: ['Osobné údaje sa spracúvajú na účely vybavenia objednávky, správy členstva, zabezpečenia vstupu, plnenia zákonných povinností a riešenia podnetov. Podrobné informácie o účeloch, právnych základoch, dobe uchovávania, príjemcoch a právach dotknutých osôb sú uvedené v samostatnom dokumente Ochrana osobných údajov, ktorý je zákazníkovi dostupný pred registráciou alebo poskytnutím údajov. Tieto podmienky nenahrádzajú informačnú povinnosť podľa GDPR.'],
      },
      {
        h: '11. Záverečné ustanovenia',
        p: [
          'Tieto podmienky sa riadia právnym poriadkom Slovenskej republiky pri zachovaní kogentných práv spotrebiteľa. Ak sa niektoré ustanovenie stane neplatným alebo nevymáhateľným, ostatné ustanovenia zostávajú zachované.',
          'Prevádzkovateľ môže podmienky meniť do budúcnosti. Aktuálna verzia bude zverejnená na webovej stránke KM GYM. Zmeny nesmú spätne odňať nadobudnuté práva zákazníka ani meniť už zaplatené obdobie v jeho neprospech.',
          'Dátum vyhotovenia: 26. október 2026.',
        ],
      },
    ],
  },

  /* --------------------------------------------------------------- GDPR */
  privacy: {
    title: 'Ochrana osobných údajov',
    lead: `Informácie o spracúvaní osobných údajov podľa čl. 13 a 14 nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. Účinné od ${new Date(L.effectiveDate).toLocaleDateString('sk-SK')}.`,
    sections: [
      {
        h: '1. Prevádzkovateľ',
        p: [`${operator}. Kontakt vo veciach osobných údajov: ${email}, ${phone}. Zodpovedná osoba nie je určená (nevyžaduje sa).`],
      },
      {
        h: '2. Aké údaje spracúvame, na aký účel a na akom právnom základe',
        dl: [
          ['Registrácia a členská zóna na webe', 'E‑mail, meno, telefón, zvolený jazyk, stav členstva, pozývací kód do tréningového denníka, prihlasovacie záznamy. Účel: vedenie členského účtu a sprístupnenie členských funkcií. Právny základ: plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR).'],
          ['Nákup členstva a vstupov, rezervácie, vstup do fitnescentra', 'Meno, e‑mail, telefón, údaje o zakúpených službách a rezerváciách, čas vstupu a vygenerované PIN kódy. Účel: uzavretie a plnenie zmluvy, otvorenie dverí, evidencia využitia služieb. Právny základ: plnenie zmluvy (čl. 6 ods. 1 písm. b)). Platobné údaje spracúva platobná brána; prevádzkovateľ ich nevidí.'],
          ['Účtovníctvo a daňové doklady', 'Fakturačné údaje a údaje o platbách. Právny základ: plnenie zákonných povinností (čl. 6 ods. 1 písm. c) – zákon o účtovníctve, zákon o DPH).'],
          ['Kamerový systém', `Obrazový záznam priestorov fitnescentra (vstup, tréningové zóny; nie šatne a sprchy). Účel: ochrana majetku, bezpečnosť osôb, objasnenie incidentov a kontrola dodržiavania podmienok vstupu v prevádzke bez recepcie. Právny základ: oprávnený záujem prevádzkovateľa (čl. 6 ods. 1 písm. f)). Priestory sú označené piktogramom pri vstupe.`],
          ['Kontaktný formulár a e‑mailová komunikácia', 'Meno, e‑mail, telefón, zvolené členstvo, správa. Účel: vybavenie požiadavky. Právny základ: oprávnený záujem na komunikácii so záujemcom, resp. predzmluvné rokovania (čl. 6 ods. 1 písm. b) a f)).'],
          ['Tréningový denník (dennik.kmgym.sk)', 'Dobrovoľná služba pre členov. Pri registrácii passkey (kryptografický kľúč viazaný na zariadenie), zvolené meno profilu, a údaje, ktoré si člen sám zapisuje (tréningy, hmotnosť, prípadne fotografie). Účel: poskytnutie denníka. Právny základ: plnenie zmluvy; citlivejšie údaje o zdraví (hmotnosť, výkonnosť) spracúvame na základe výslovného súhlasu udeleného ich zapísaním (čl. 9 ods. 2 písm. a)), ktorý možno kedykoľvek odvolať vymazaním údajov alebo účtu.'],
          ['Transakčné e‑maily', 'E‑mailová adresa a obsah správ (potvrdenie registrácie, obnova hesla, potvrdenie rezervácie a PIN). Právny základ: plnenie zmluvy.'],
        ],
      },
      {
        h: '3. Príjemcovia a sprostredkovatelia',
        p: ['Údaje spracúvajú v mene prevádzkovateľa títo sprostredkovatelia, s ktorými sú uzavreté zmluvy o spracúvaní osobných údajov:'],
        ul: [
          'Reservine (rezervačný systém, platby, generovanie PIN kódov do zámku) a jeho platobná brána – servery v EÚ.',
          'TTLock / Sciener (cloud inteligentného zámku vstupných dverí) – spracúva PIN kódy a čas otvorenia; prevádzkovateľ zámku môže údaje spracúvať aj mimo EÚ na základe štandardných zmluvných doložiek.',
          'Supabase (databáza a prihlasovanie členskej zóny) – servery v EÚ.',
          'Vercel (hosting webu) a Railway (hosting tréningového denníka) – servery v EÚ (Frankfurt / Amsterdam).',
          'Resend (odosielanie e‑mailov).',
          'Externá účtovná spoločnosť a poskytovateľ kamerového systému (servis). Záznam z kamier môže byť poskytnutý orgánom činným v trestnom konaní alebo poisťovni pri riešení incidentu.',
        ],
      },
      {
        h: '4. Doba uchovávania',
        ul: [
          'Údaje členského účtu – počas trvania registrácie a 12 mesiacov po poslednom prihlásení alebo skončení členstva, potom sa účet vymaže. Účet si môže člen zrušiť kedykoľvek žiadosťou na ' + email + '.',
          'Údaje o rezerváciách a vstupoch – 12 mesiacov od uskutočnenia.',
          'Účtovné a daňové doklady – 10 rokov podľa zákona o účtovníctve.',
          `Kamerový záznam – ${L.cameraRetentionDays} dní, potom sa automaticky prepisuje; pri incidente sa príslušná časť uchová do jeho vyriešenia.`,
          'Správy z kontaktného formulára – 6 mesiacov od vybavenia.',
          'Tréningový denník – kým člen údaje alebo účet sám nevymaže; neaktívne účty sa po skončení členstva deaktivujú a po 12 mesiacoch vymažú.',
        ],
      },
      {
        h: '5. Práva dotknutej osoby',
        p: ['Máš právo na prístup k údajom, ich opravu, vymazanie, obmedzenie spracúvania, prenosnosť (pri údajoch spracúvaných na základe zmluvy alebo súhlasu), právo namietať proti spracúvaniu na základe oprávneného záujmu (vrátane kamerového systému) a právo kedykoľvek odvolať súhlas bez vplyvu na zákonnosť predchádzajúceho spracúvania.', `Žiadosti vybavujeme do 30 dní na ${email}. Ak sa domnievaš, že spracúvanie porušuje právne predpisy, máš právo podať sťažnosť Úradu na ochranu osobných údajov SR, Hraničná 12, 820 07 Bratislava 27, www.dataprotection.gov.sk.`],
      },
      {
        h: '6. Automatizované rozhodovanie a profilovanie',
        p: ['Prevádzkovateľ nevykonáva automatizované rozhodovanie s právnym účinkom ani profilovanie. PIN kód do dverí sa generuje automaticky výlučne na základe platnej rezervácie.'],
      },
      {
        h: '7. Zabezpečenie',
        p: ['Údaje sú prenášané šifrovane (HTTPS), prihlasovanie do členskej zóny je chránené heslom a do denníka passkey technológiou. Prístup k údajom majú len poverené osoby prevádzkovateľa v rozsahu nevyhnutnom na ich úlohy.'],
      },
    ],
  },

  /* ------------------------------------------------------------ Cookies */
  cookies: {
    title: 'Cookies',
    lead: 'Ako používame cookies a podobné technológie na webe kmgym.sk.',
    sections: [
      {
        h: '1. Nevyhnutné technické údaje (bez súhlasu)',
        ul: [
          'km_locale – zvolený jazyk webu (cookie, 12 mesiacov).',
          'km_theme – zvolený tmavý/svetlý vzhľad (localStorage, kým ho nezmeníš).',
          'km_consent – tvoja voľba v cookie lište, ak sa zobrazí (localStorage, 12 mesiacov).',
          'Prihlasovacie cookies členskej zóny (sb-…-auth-token) – udržiavajú prihlásenie; platia do odhlásenia, najviac 7 dní bez aktivity.',
        ],
        p: ['Tieto údaje sú nevyhnutné na fungovanie webu, neslúžia na sledovanie a nevyžadujú súhlas (§ 109 ods. 8 zákona č. 452/2021 Z. z. o elektronických komunikáciách).'],
      },
      {
        h: '2. Analytické a marketingové cookies (len so súhlasom)',
        p: [
          site.analytics.gaId || site.analytics.metaPixelId
            ? 'Web používa nástroje na meranie návštevnosti (Google Analytics) a prípadne marketingové nástroje (Meta Pixel). Načítajú sa výlučne po kliknutí na „Súhlasím“ v cookie lište. Odmietnutie je rovnako jednoduché ako súhlas a web funguje bez obmedzení. Voľbu môžeš kedykoľvek zmeniť odkazom „Nastavenia cookies“ v päte stránky.'
            : 'Web momentálne nepoužíva žiadne analytické ani marketingové cookies (Google Analytics, Meta Pixel a pod.). Ak ich v budúcnosti nasadíme, načítajú sa až po tvojom výslovnom súhlase v cookie lište, s rovnako dostupnou možnosťou odmietnuť.',
        ],
      },
      {
        h: '3. Služby tretích strán',
        p: ['Rezervačný systém Reservine (kmgym.reservine.me) a tréningový denník (dennik.kmgym.sk) sú samostatné stránky s vlastnými nevyhnutnými cookies. Mapa na stránke Kontakt sa načítava z Google Maps až po tvojej interakcii.'],
      },
    ],
  },

  /* ---------------------------------------------------------- Reklamácie */
  complaints: {
    title: 'Reklamačný poriadok',
    lead: `Postup pri uplatnení práv zo zodpovednosti za vady služieb KM GYM. Účinný od ${new Date(L.effectiveDate).toLocaleDateString('sk-SK')}.`,
    sections: [
      {
        h: '1. Všeobecné ustanovenia',
        p: [`Tento reklamačný poriadok upravuje postup pri reklamácii služieb poskytovaných prevádzkovateľom ${o.name} (${gym}) v súlade s Občianskym zákonníkom a zákonom č. 108/2024 Z. z. o ochrane spotrebiteľa.`],
      },
      {
        h: '2. Čo možno reklamovať',
        ul: [
          'Nefunkčnosť vstupu (PIN kód neotvoril dvere v rezervovanom čase) – kontaktuj nás ihneď telefonicky, vstup ti vrátime alebo členstvo predĺžime.',
          'Nedostupnosť fitnescentra alebo podstatnej časti vybavenia počas platnosti členstva z dôvodov na strane prevádzkovateľa.',
          'Nesprávne účtovaná cena alebo nesprávne aktivované členstvo či vstupy.',
        ],
      },
      {
        h: '3. Uplatnenie reklamácie',
        p: [
          `Reklamáciu uplatni bez zbytočného odkladu, najneskôr do 24 mesiacov od poskytnutia služby, e‑mailom na ${email}, telefonicky na ${phone} alebo písomne na adresu prevádzkovateľa. Uveď meno, e‑mail použitý pri nákupe, dátum a čas rezervácie a popis problému.`,
          'Prevádzkovateľ vydá potvrdenie o uplatnení reklamácie (e‑mailom) a rozhodne o nej ihneď, v zložitých prípadoch do 3 pracovných dní; vybavenie reklamácie nesmie trvať dlhšie ako 30 dní od jej uplatnenia. O vybavení informuje spotrebiteľa písomne (e‑mailom).',
        ],
      },
      {
        h: '4. Spôsob vybavenia',
        ul: [
          'Oprávnená reklamácia sa vybaví náhradným vstupom, predĺžením platnosti členstva o dotknuté obdobie, primeranou zľavou alebo vrátením ceny, resp. jej pomernej časti, podľa voľby spotrebiteľa a povahy vady.',
          'Vrátenie platby sa vykoná do 14 dní od vybavenia reklamácie na platobnú kartu, ktorou bola platba vykonaná, ak sa nedohodne inak.',
          'Reklamáciu nemožno uznať, ak vada vznikla porušením prevádzkového poriadku, nesprávnym používaním zariadenia alebo nedostavením sa na rezerváciu.',
        ],
      },
      {
        h: '5. Alternatívne riešenie sporov',
        p: ['Ak spotrebiteľ nie je spokojný s vybavením reklamácie alebo sa domnieva, že prevádzkovateľ porušil jeho práva, môže sa obrátiť na prevádzkovateľa so žiadosťou o nápravu a následne podať návrh na alternatívne riešenie sporu Slovenskej obchodnej inšpekcii (www.soi.sk, ars@soi.sk) alebo inému subjektu zo zoznamu Ministerstva hospodárstva SR, podľa zákona č. 391/2015 Z. z.'],
      },
    ],
  },

  /* ----------------------------------------------------- Prevádzkový poriadok */
  operating: {
    title: 'Prevádzkový poriadok',
    lead: `Pravidlá vstupu, bezpečnosti a hygieny vo fitnescentre KM GYM, ${gym}. Platí pre každého návštevníka. Účinný od ${new Date(L.effectiveDate).toLocaleDateString('sk-SK')}.`,
    sections: [
      {
        h: '1. Prevádzka a vstup',
        ul: [
          'Fitnescentrum je otvorené nonstop, bez obsluhy. Vstup je možný len s platnou rezerváciou a osobným PIN kódom, ktorý platí počas rezervovaného času.',
          'PIN kód je neprenosný. Je zakázané vpúšťať do priestorov iné osoby alebo im kód poskytnúť. Každý návštevník musí mať vlastnú rezerváciu.',
          `Osoby mladšie ako ${L.minAgeAlone} rokov cvičia len v sprievode zodpovednej dospelej osoby. Osoby vo veku 15 – 17 rokov môžu vstupovať samostatne len s písomným súhlasom zákonného zástupcu schváleným prevádzkovateľom; samostatný vstup maloletých nie je povolený v čase ${L.minorsCurfew}.`,
          'Pri odchode skontroluj, či sa vstupné dvere zatvorili a zamkli.',
          'Priestory sú monitorované kamerovým systémom so záznamom (okrem šatní a spŕch) na účely bezpečnosti a ochrany majetku – podrobnosti v dokumente Ochrana osobných údajov.',
        ],
      },
      {
        h: '2. Bezpečnosť',
        ul: [
          'Cvičíš na vlastnú zodpovednosť. Ak máš zdravotné obmedzenia, poraď sa vopred s lekárom. Pri nevoľnosti alebo zranení prestaň cvičiť a volaj 112; núdzový kontakt prevádzkovateľa: ' + phone + '.',
          'Lekárnička je umiestnená pri vstupe. [DOPLNIŤ – presné miesto]',
          'Používaj zariadenie len spôsobom, na ktorý je určené. Pri veľkých váhach používaj bezpečnostné zarážky stojana alebo dopomoc. Nepreťažuj stroje nad uvedenú nosnosť.',
          'Je zakázaný vstup pod vplyvom alkoholu alebo návykových látok, fajčenie a manipulácia s otvoreným ohňom.',
          'Zistené poškodenie zariadenia ihneď nahlás telefonicky alebo e‑mailom; poškodené zariadenie nepoužívaj.',
        ],
      },
      {
        h: '3. Hygiena a poriadok',
        ul: [
          'Vstup do tréningových zón len v čistej športovej obuvi určenej do interiéru.',
          'Na lavičky a stroje používaj uterák; po tréningu zariadenie utri dezinfekciou, ktorá je k dispozícii.',
          'Po cvičení vráť činky, kotúče a náradie na určené miesto.',
          'Šatne a sprchy udržiavaj v čistote. Odložené veci si zamkni do skrinky; za veci odložené mimo skriniek prevádzkovateľ nezodpovedá.',
          'Nápoje len v uzatvárateľných fľašiach; sklo nie je povolené.',
        ],
      },
      {
        h: '4. Ohľaduplnosť',
        ul: [
          'Správaj sa ohľaduplne k ostatným, nehádž činky na zem, nefoť a nenahrávaj iné osoby bez ich súhlasu.',
          'Hudbu počúvaj len cez slúchadlá.',
          'Rešpektuj rezervovaný čas; ak chceš cvičiť dlhšie, predĺž si rezerváciu v aplikácii.',
        ],
      },
      {
        h: '5. Porušenie poriadku',
        p: ['Pri porušení tohto poriadku môže prevádzkovateľ návštevníka vyzvať na opustenie priestorov, zrušiť členstvo bez nároku na vrátenie ceny za nevyužité obdobie a požadovať náhradu spôsobenej škody. Závažné prípady (vpustenie cudzej osoby, krádež, vandalizmus) budú riešené aj s políciou s využitím kamerového záznamu.'],
      },
    ],
  },

  /* -------------------------------------------------------- Odstúpenie */
  withdrawal: {
    title: 'Formulár na odstúpenie od zmluvy',
    lead: 'Vyplň a pošli len v prípade, že chceš odstúpiť od zmluvy uzavretej na diaľku do 14 dní od nákupu. Formulár môžeš vytlačiť alebo skopírovať do e‑mailu.',
    sections: [
      {
        h: 'Komu',
        p: [`${o.name}, ${o.street}, ${o.zip} ${o.city}, e‑mail: ${email}`],
      },
      {
        h: 'Oznámenie o odstúpení od zmluvy',
        p: [
          'Týmto oznamujem, že odstupujem od zmluvy o poskytnutí tejto služby: ……………………………………………… (členstvo / vstup, názov balíka)',
          'Dátum objednania / zaplatenia: ………………………',
          'Meno a priezvisko spotrebiteľa: ………………………………………………',
          'Adresa spotrebiteľa: ………………………………………………',
          'E‑mail použitý pri nákupe: ………………………………………………',
          'Podpis spotrebiteľa (iba ak sa formulár podáva v listinnej podobe): ………………………',
          'Dátum: ………………………',
        ],
      },
      {
        h: 'Poučenie',
        p: [
          'Lehota na odstúpenie je 14 dní odo dňa uzavretia zmluvy (zaplatenia). Lehota je zachovaná, ak oznámenie odošleš v jej posledný deň.',
          'Ak si požiadal o začatie poskytovania služby počas tejto lehoty (aktivácia členstva alebo vstupu ihneď po zaplatení), uhradíš cenu za službu poskytnutú do dňa odstúpenia; po úplnom poskytnutí služby (využitý vstup) právo na odstúpenie zaniká. Platbu, resp. jej zostatok, ti vrátime do 14 dní rovnakým spôsobom, akým bola vykonaná.',
        ],
      },
    ],
  },
};
