import { CEFRLevel, ReadingPart } from "./types"

export interface ExamSet {
  id: string
  title: string
  title_uz: string
  cefr_level: CEFRLevel
  duration_minutes: number
  parts: ReadingPart[]
  language: "uz" | "en"
}
// 1. Imtihonlarni alohida o'zgaruvchilarga olib chiqish (kod o'qishga qulay bo'lishi uchun)
const testB2_01: ExamSet = {
  id: "b2-reading-01",
  title: "The Future of Work",
  title_uz: "Ish kelajagi",
  cefr_level: "B2",
  duration_minutes: 60,
  language: "en",
  parts: [
        {
            id: 1,
            title: "Part 1: Looking for a new Earth",
            title_uz: "Qism 1: Yangi Yer izlash",
            description: "Read the text. Fill in each gap with ONE word. You must use a word which is somewhere in the rest of the text.",
            description_uz: "Matnni o'qing va har bir bo'sh joyni BIR so'z bilan to'ldiring.",
            passage: `Looking for a new Earth

For thousands of years, humans have explored the Earth. Nowadays, we are exploring space. Astronomers are the modern-day explorers. Currently, many _________________ are looking for new planets and new places for humans to live in the future. But where do astronomers start looking? First of all, astronomers look for a star. That's because our own Earth orbits a star (the Sun). More importantly, it is the correct distance from the Sun for heat and light. So when astronomers have found the right _________________, they look at the planets around it. In recent years, astronomers have found nearly 400 new planets with stars. Unfortunately, many of these _________________ are either too near to the star or too far away.

However, if the planet is in a good position, astronomers _________________ for three key things: water, air and rock. Water is important because all life needs water. Humans can drink it and they can also grow plants with water. And _________________ produce air for humans to breathe and food to eat. So all life on other planets will need water and air. _________________ on a planet is also important. That's because there is often water under the rocks.`,
            questions: [
                {
                    id: 1,
                    type: "GAP_FILL",
                    text: "Currently, many (1) _________________ are looking for new planets and new places for humans to live in the future.",
                    word_limit: 1,
                    correct_answer: "astronomers",
                },
                {
                    id: 2,
                    type: "GAP_FILL",
                    text: "So when astronomers have found the right (2) _________________, they look at the planets around it.",
                    word_limit: 1,
                    correct_answer: "star",
                },
                {
                    id: 3,
                    type: "GAP_FILL",
                    text: "Unfortunately, many of these (3) _________________ are either too near to the star or too far away.",
                    word_limit: 1,
                    correct_answer: "planets",
                },
                {
                    id: 4,
                    type: "GAP_FILL",
                    text: "However, if the planet is in a good position, astronomers (4) _________________ for three key things: water, air and rock.",
                    word_limit: 1,
                    correct_answer: "search",
                },
                {
                    id: 5,
                    type: "GAP_FILL",
                    text: "And (5) _________________ produce air for humans to breathe and food to eat.",
                    word_limit: 1,
                    correct_answer: "plants",
                },
                {
                    id: 6,
                    type: "GAP_FILL",
                    text: "(6) _________________ on a planet is also important. That's because there is often water under the rocks.",
                    word_limit: 1,
                    correct_answer: "Rock",
                },
            ],
        },
        {
            id: 2,
            title: "Part 2: Language Learning Programs",
            title_uz: "Qism 2: Til O'qitish Dasturlari",
            description: "Read the texts 7-14 and the statements A-J. Decide which text matches with the situation described in the statements.",
            description_uz: "7-14 matnlarni o'qing va A-J iboralari bilan moslashtiring.",
            passage: `Language Learning Programs

7. English Plus is a 4-week course in London designed for professionals who need to improve their English for work. The mornings focus on general English language skills while afternoons offer specialized modules in Business English and Technical English. Upon completion of the course, participants receive a recognized certificate. The school provides accommodation with local families for those who need it.

8. Globe Workshops offers a unique approach to learning English combined with adventure activities. During the day, students attend English classes focusing on conversation and communication skills. In the evenings and weekends, students can participate in sports, cultural trips, and outdoor activities with other international students, making new friends while practicing English in real situations.

9. The Oxford Institute provides intensive university preparation courses for international students wishing to study at British universities. The 12-week program combines English language study with subject-specific academic skills training. Students are prepared for university entrance exams and receive guidance on university applications and student life in the UK.

10. Summer English Academy offers a specialized 6-week summer program for teenagers. The curriculum combines English language lessons with exciting activities such as sports, drama, music, and cultural excursions. The program is designed to improve English skills while allowing teenagers to enjoy their summer break and make international friendships.

11. The Polyglot Center specializes in teaching multiple languages including English, French, Spanish, and Mandarin. Small class sizes ensure personalized attention. The center offers flexible scheduling with both day and evening classes. All courses include cultural education about the countries where the languages are spoken.

12. European Language Institute combines language learning with work experience. Participants study English in the mornings and work part-time at local companies in the afternoons, gaining practical experience while practicing English in professional environments. No accommodation is provided; students must find their own lodging.

13. Academic Excellence College offers intensive English preparation for international students taking the IELTS and TOEFL examinations. The 8-week course focuses on test-taking strategies, vocabulary building, and practice with past papers. Upon course completion, students must take and pass the IELTS or TOEFL exam as a final requirement for certification.

14. Cultural Exchange Programs provides English courses combined with cultural immersion. Students live with host families and participate in cultural activities while learning English. The program emphasizes real-world communication in authentic cultural settings, preparing students for effective communication with English speakers worldwide.`,
            questions: [
                {
                    id: 7,
                    type: "TEXT_MATCH",
                    text: "A) You need to learn the language for your job.",
                    options: [
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                        { label: "11", value: "11" },
                        { label: "12", value: "12" },
                        { label: "13", value: "13" },
                        { label: "14", value: "14" },
                    ],
                    correct_answer: "7",
                },
                {
                    id: 8,
                    type: "TEXT_MATCH",
                    text: "C) You want to learn the language and do interesting things in your free time.",
                    options: [
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                        { label: "11", value: "11" },
                        { label: "12", value: "12" },
                        { label: "13", value: "13" },
                        { label: "14", value: "14" },
                    ],
                    correct_answer: "8",
                },
                {
                    id: 9,
                    type: "TEXT_MATCH",
                    text: "E) You want to have a higher education in England.",
                    options: [
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                        { label: "11", value: "11" },
                        { label: "12", value: "12" },
                        { label: "13", value: "13" },
                        { label: "14", value: "14" },
                    ],
                    correct_answer: "9",
                },
                {
                    id: 10,
                    type: "TEXT_MATCH",
                    text: "F) You want to learn the language next summer.",
                    options: [
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                        { label: "11", value: "11" },
                        { label: "12", value: "12" },
                        { label: "13", value: "13" },
                        { label: "14", value: "14" },
                    ],
                    correct_answer: "10",
                },
                {
                    id: 11,
                    type: "TEXT_MATCH",
                    text: "H) You would like to learn more than one language.",
                    options: [
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                        { label: "11", value: "11" },
                        { label: "12", value: "12" },
                        { label: "13", value: "13" },
                        { label: "14", value: "14" },
                    ],
                    correct_answer: "11",
                },
                {
                    id: 12,
                    type: "TEXT_MATCH",
                    text: "J) You want to meet people from local companies during the course.",
                    options: [
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                        { label: "11", value: "11" },
                        { label: "12", value: "12" },
                        { label: "13", value: "13" },
                        { label: "14", value: "14" },
                    ],
                    correct_answer: "12",
                },
                {
                    id: 13,
                    type: "TEXT_MATCH",
                    text: "I) You need to take an exam, finishing the course.",
                    options: [
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                        { label: "11", value: "11" },
                        { label: "12", value: "12" },
                        { label: "13", value: "13" },
                        { label: "14", value: "14" },
                    ],
                    correct_answer: "13",
                },
                {
                    id: 14,
                    type: "TEXT_MATCH",
                    text: "G) You need a free place to stay while studying.",
                    options: [
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                        { label: "11", value: "11" },
                        { label: "12", value: "12" },
                        { label: "13", value: "13" },
                        { label: "14", value: "14" },
                    ],
                    correct_answer: "14",
                },
            ],
        },
        {
            id: 3,
            title: "Part 3: The Ultimate Green Home",
            title_uz: "Qism 3: Yakuniy Yashil Uy",
            description: "Read the text and choose the correct heading for each paragraph from the list of headings below.",
            description_uz: "Matnni o'qing va har bir paragrafsiga to'g'ri sarlavhani tanlang.",
            passage: `The Ultimate Green Home

Sandwiched between an incredibly ugly shopping centre and a busy main road, the environmentalist Sir David Attenborough, no less, is planting a tree and declaring: 'Today is a historic day.' He really means it.

I. Maybe our children's future will be an overheated, desert-like world, but if it's not, it will probably look a lot like this. The new, highly environmentally friendly home of the World Wide Fund for Nature, a hemispherical glass tube standing above a council car park, was officially opened today, watched by a small but enthusiastic crowd. If humanity is to survive, they must have been thinking, it will do so living in buildings of this kind.

II. Known as the 'Living Planet Centre', it has jumping panda animations that greet visitors to its WWF Experience, where schoolchildren can interact with Ocean, River, Forest and Wildlife Zones. Since the mid-20th century, many of the ideas behind humanity's attempts to protect animals and the natural world have been started by the WWF. It is hoped their new home will be a living example of that.

III. 'The World Wide Fund for Nature is one of the great hopes for the world,' Sir David Attenborough said. 'This building enshrines that, and advertises it to the world.' The concrete is all recycled, as is the carpet and even most of the computer equipment, and there are many solar energy panels. Other such features include extensive glass to increase natural light, natural ventilation, rainwater in the toilets, and heat pumps that bring warm air up from 200 metres below. In addition, new habitats and plant species have been installed around the gardens, while indoors a home has been found for three tall trees.

IV. The sense of total calm inside, from the high curved ceilings to the plants and trees, is all the more remarkable for the building's urban location. It has been built between a canal and a small area of woods listed as a Site of Special Scientific Interest. Even so, it remains in an ugly corner of a fairly unattractive town centre. The contrast gives us an idea of what might just be possible in the future.

V. The WWF was set up in 1961. The organisation originally fought to protect individual species, such as the Arabian oryx, from extinction. Eventually, the focus moved from individual species to ecosystems: all the living things in one area and the way they affect each other. Sir David, who is an ambassador for the WWF, said: 'Now, it's not just individual ecosystems. Now the change is to a global approach. If you want to do something, you have to persuade people of the world not to pollute. That is because the planet is one vast ecosystem. The WWF has been the leader in changing everyone's attitudes towards nature.'

VI. Sir David is clear about the task ahead, and more importantly, unlike many environmentalists, he believes it is not too late to make a difference. 'You can't turn the clock back, of course. That means you can't put back forests that are gone, not for a century, and the population size is not going to shrink. But we can slow down the rate at which the numbers are increasing, we can cut down the carbon we put in the atmosphere,' he said. 'It's never happened before that the whole world has come together and made a decision'. To go as far as we have done to reduce carbon is an impressive achievement.`,
            questions: [
                {
                    id: 15,
                    type: "HEADINGS_MATCH",
                    text: "15. Paragraph I",
                    options: [
                        { label: "A) An educational experience", value: "A" },
                        { label: "B) To change the outlook on nature", value: "B" },
                        { label: "C) An environmentally conscious location", value: "C" },
                        { label: "D) Necessary steps to take", value: "D" },
                        { label: "E) Room for improvement", value: "E" },
                        { label: "F) Eco-friendly solutions", value: "F" },
                        { label: "G) Building of the future", value: "G" },
                        { label: "H) Combination of nice and ugly", value: "H" },
                    ],
                    correct_answer: "G",
                },
                {
                    id: 16,
                    type: "HEADINGS_MATCH",
                    text: "16. Paragraph II",
                    options: [
                        { label: "A) An educational experience", value: "A" },
                        { label: "B) To change the outlook on nature", value: "B" },
                        { label: "C) An environmentally conscious location", value: "C" },
                        { label: "D) Necessary steps to take", value: "D" },
                        { label: "E) Room for improvement", value: "E" },
                        { label: "F) Eco-friendly solutions", value: "F" },
                        { label: "G) Building of the future", value: "G" },
                        { label: "H) Combination of nice and ugly", value: "H" },
                    ],
                    correct_answer: "A",
                },
                {
                    id: 17,
                    type: "HEADINGS_MATCH",
                    text: "17. Paragraph III",
                    options: [
                        { label: "A) An educational experience", value: "A" },
                        { label: "B) To change the outlook on nature", value: "B" },
                        { label: "C) An environmentally conscious location", value: "C" },
                        { label: "D) Necessary steps to take", value: "D" },
                        { label: "E) Room for improvement", value: "E" },
                        { label: "F) Eco-friendly solutions", value: "F" },
                        { label: "G) Building of the future", value: "G" },
                        { label: "H) Combination of nice and ugly", value: "H" },
                    ],
                    correct_answer: "F",
                },
                {
                    id: 18,
                    type: "HEADINGS_MATCH",
                    text: "18. Paragraph IV",
                    options: [
                        { label: "A) An educational experience", value: "A" },
                        { label: "B) To change the outlook on nature", value: "B" },
                        { label: "C) An environmentally conscious location", value: "C" },
                        { label: "D) Necessary steps to take", value: "D" },
                        { label: "E) Room for improvement", value: "E" },
                        { label: "F) Eco-friendly solutions", value: "F" },
                        { label: "G) Building of the future", value: "G" },
                        { label: "H) Combination of nice and ugly", value: "H" },
                    ],
                    correct_answer: "H",
                },
                {
                    id: 19,
                    type: "HEADINGS_MATCH",
                    text: "19. Paragraph V",
                    options: [
                        { label: "A) An educational experience", value: "A" },
                        { label: "B) To change the outlook on nature", value: "B" },
                        { label: "C) An environmentally conscious location", value: "C" },
                        { label: "D) Necessary steps to take", value: "D" },
                        { label: "E) Room for improvement", value: "E" },
                        { label: "F) Eco-friendly solutions", value: "F" },
                        { label: "G) Building of the future", value: "G" },
                        { label: "H) Combination of nice and ugly", value: "H" },
                    ],
                    correct_answer: "B",
                },
                {
                    id: 20,
                    type: "HEADINGS_MATCH",
                    text: "20. Paragraph VI",
                    options: [
                        { label: "A) An educational experience", value: "A" },
                        { label: "B) To change the outlook on nature", value: "B" },
                        { label: "C) An environmentally conscious location", value: "C" },
                        { label: "D) Necessary steps to take", value: "D" },
                        { label: "E) Room for improvement", value: "E" },
                        { label: "F) Eco-friendly solutions", value: "F" },
                        { label: "G) Building of the future", value: "G" },
                        { label: "H) Combination of nice and ugly", value: "H" },
                    ],
                    correct_answer: "D",
                },
            ],
        },
        {
            id: 4,
            title: "Part 4: Stamps",
            title_uz: "Qism 4: Marqalar",
            description: "Read the text and answer questions 21-29.",
            description_uz: "Matnni o'qing va 21-29 savollarni javob bering.",
            passage: `Stamps

My parents called me Penelope and, as often happens with first names in the UK, it was shortened to Penny. When I first went to school teachers teased me about my name. They started to call me Penny Black. I had no idea why it was so funny or why they changed my name from White to Black. Later I discovered that this was the name of the very first stamp. I was so absorbed I had to find out more; I started collecting when I was eight.

Stamps are one of those everyday items that people, especially children, take for granted. In our world of email and text messaging it's almost impossible to imagine a time when you couldn't communicate to anyone in writing at all. Before 1635 there was only one person who could send and receive letters in Britain and that was the monarch – letters were only carried to and from the Royal Court. It was King Charles I who allowed the use of the Royal Mail to members of the public and that's when the Post Office system was founded.

But the whole process of sending a letter was both complicated and expensive. Because the fee was calculated on how many sheets were written and the distance travelled. So, as a result it was only businesses and the wealthy who could afford to send letters. All this changed on 6 May 1840 when the world's earliest adhesive postage stamp went on sale. Not only was the process of sending a letter made easier but, at only one penny a stamp, it was also affordable for everyone. The impact of the Penny Black was incredible. First of all literacy standards improved dramatically. Then economic growth increased as people started to use stamps to invest their hard-earned money. No more saving your pennies in a sock under the bed!

So a small piece of gummed paper revolutionised a country. But others were quick to follow. The Brazilians were next issuing their famous 'Bull's Eye' stamps on 1 August 1843, they were followed by Switzerland in the same year, the USA and Mauritius in 1847 and then France and Belgium in 1849. But far from having just an administrative function stamps also reflect the society that produces them. I remember being fascinated by my first stamps from Magyar Posta – first of all I never knew where Magyar was and secondly because the stamps had a heroic, working class feel about them. There were often pictures of young people working in agriculture or industry – scenes which would never appear on a British stamp. In the UK, we favour portraying individuals famous for their personal achievements. The person who has appeared on most stamps, other than a British monarch, is Sir Winston Churchill, the prime minister during the Second World War. The second is the Italian-born explorer Christopher Columbus although they tend to picture his ships, or places named after him, rather than an actual portrait of the man.

For me one of the most interesting sets of stamps, historically, is the one issued in January 1900 by the Nicaraguans. The US government had long been interested in a canal cutting through Central America but couldn't decide on whether it should be in Nicaragua or Panama. Then Nicaragua issued a new definitive series of stamps whose main design showed Mount Momotombo with smoke billowing from its highest point. A rival to the idea of Nicaragua being favoured circulated the stamps to every US Congressman and Senator and as a result Panama was chosen. In fact, the volcano had been dormant for centuries but the artist wanted the mountain to look more interesting!`,
            questions: [
                {
                    id: 21,
                    type: "MULTIPLE_CHOICE",
                    text: "It is stated that Charles I ...",
                    options: [
                        { label: "A", value: "used to be the first postman." },
                        { label: "B", value: "sent letters to the public only." },
                        { label: "C", value: "was the founder of the Royal Mail." },
                        { label: "D", value: "established the postal service." },
                    ],
                    correct_answer: "D",
                },
                {
                    id: 22,
                    type: "MULTIPLE_CHOICE",
                    text: "When was the first stamp created?",
                    options: [
                        { label: "A", value: "1635" },
                        { label: "B", value: "1840" },
                        { label: "C", value: "1843" },
                        { label: "D", value: "1900" },
                    ],
                    correct_answer: "B",
                },
                {
                    id: 23,
                    type: "MULTIPLE_CHOICE",
                    text: "The Penny Black had a huge impact on ...",
                    options: [
                        { label: "A", value: "stamps." },
                        { label: "B", value: "economy." },
                        { label: "C", value: "letters." },
                        { label: "D", value: "standards." },
                    ],
                    correct_answer: "B",
                },
                {
                    id: 24,
                    type: "MULTIPLE_CHOICE",
                    text: "Unlike the UK, in some countries, stamps...",
                    options: [
                        { label: "A", value: "reflected individuals' way of thinking." },
                        { label: "B", value: "were the symbol of possessions." },
                        { label: "C", value: "had the portraits of local buildings." },
                        { label: "D", value: "were produced by high-class people." },
                    ],
                    correct_answer: "A",
                },
                {
                    id: 25,
                    type: "TRUE_FALSE_NOT_GIVEN",
                    text: "The author herself changed her name because of stamps.",
                    correct_answer: "FALSE",
                },
                {
                    id: 26,
                    type: "TRUE_FALSE_NOT_GIVEN",
                    text: "The number of pages was estimated to set exact price.",
                    correct_answer: "TRUE",
                },
                {
                    id: 27,
                    type: "TRUE_FALSE_NOT_GIVEN",
                    text: "Stamps made a great contribution to the development of the UK.",
                    correct_answer: "TRUE",
                },
                {
                    id: 28,
                    type: "TRUE_FALSE_NOT_GIVEN",
                    text: "Italian stamps often pictured Christopher Columbus's ships.",
                    correct_answer: "NOT GIVEN",
                },
                {
                    id: 29,
                    type: "TRUE_FALSE_NOT_GIVEN",
                    text: "The US government decided that a canal in Central America should be in Nicaragua.",
                    correct_answer: "FALSE",
                },
            ],
        },
        {
            id: 5,
            title: "Part 5: Migratory Lifestyle",
            title_uz: "Qism 5: Ko'chmanchu Hayoti",
            description: "Read the text and answer questions 30-35.",
            description_uz: "Matnni o'qing va 30-35 savollarni javob bering.",
            passage: `Migratory Lifestyle

Out of a world population of 7.5 billion, around 30 million people currently lead a migratory lifestyle. Every continent has nomadic groups, leading a life very different from the sedentary communities they come into contact with. Almost all migratory communities are in steady decline for a wide range of reasons: climate change, political unrest, forced resettlement and armed conflict have all impacted on these traditional communities, diminishing their numbers year on year. However, the lure of the travelling lifestyle is as strong as ever. The 'gypsy lifestyle' continues to inspire people - especially the young - who crave the freedom of unstructured movement. Backpacking has become almost a rite of passage for the young. 'Gap years' between school and university often stretch to two years, or even more, as young people become addicted to the culture of travelling light and moving on.

Traditional nomads may be seen as 'wanderers', but their movement is not as unstructured as it may appear. Most nomadic communities are, or were, herdsmen, leading their animals across fixed routes based on pastures. Their societies were based on strong bonds of kinship.

According to 14th-century social historian Ibn Khaldun, the Bedouin community owed their success in battle to asabiyyah or 'group feeling', which enhanced their ability to protect the group from outsiders. This, along with excellent horsemanship and the rigours of a harsh lifestyle, based around constant alertness needed to protect livestock, made them formidable adversaries in war when compared to their more settled counterparts.

Far from the desert-dwelling Bedouin live a different kind of nomad: the Moken, or sea gypsies, of the Mergui Archipelago between Myanmar and the islands of Thailand's North Andaman coast. During the dry season, they live on traditional houseboats, and during the monsoon season they build temporary villages on sheltered stretches of beach. Theirs is a culture of sharing and giving, to the extent that their language contains no words for individual possessions. These indigenous people have a great understanding of and respect for their environment, making use of over 80 plant species for food and more than 100 for shelter, handicrafts and other purposes. However, the Moken's lifestyle has more recently been affected by government restrictions on their hunter-gathering activities, and legal disputes over ownership of their traditional lands. Somewhat inevitably, they have become a focus for tourism in the area, which they have embraced to some extent as they try to adapt to the modern world. Nomadic communities exist in Europe too. In the tundras and taigas of northern Scandinavia live a reindeer-herding community, the Sami. Originally travelling freely across the areas which now belong to Norway, Sweden, Finland and Russia, this subculture has had its traditional lifestyle curtailed by the creation of national borders.`,
            questions: [
                {
                    id: 30,
                    type: "GAP_FILL",
                    text: "Migratory lifestyles (30) __________ the youth who are eager to have unplanned travel.",
                    word_limit: 1,
                    correct_answer: "attract",
                },
                {
                    id: 31,
                    type: "GAP_FILL",
                    text: "Nomadic herders tend to choose their way taking (31) __________ into account.",
                    word_limit: 1,
                    correct_answer: "pastures",
                },
                {
                    id: 32,
                    type: "GAP_FILL",
                    text: "The Bedouin community had to be cautious all the time to (32) __________ their farm animals.",
                    word_limit: 1,
                    correct_answer: "protect",
                },
                {
                    id: 33,
                    type: "GAP_FILL",
                    text: "The Moken have no words for (33) __________ property.",
                    word_limit: 1,
                    correct_answer: "individual",
                },
                {
                    id: 34,
                    type: "MULTIPLE_CHOICE",
                    text: "According to the passage, the Moken ...",
                    options: [
                        { label: "A", value: "hardly share their own possessions." },
                        { label: "B", value: "live on the sea during the rainy season." },
                        { label: "C", value: "changed their lifestyle because of restrictions." },
                        { label: "D", value: "escaped to become accustomed to the modern world." },
                    ],
                    correct_answer: "C",
                },
                {
                    id: 35,
                    type: "MULTIPLE_CHOICE",
                    text: "What is the writer's purpose in the reading passage?",
                    options: [
                        { label: "A", value: "to explain the future of backpacking culture" },
                        { label: "B", value: "to compare the success of different nomadic groups" },
                        { label: "C", value: "to criticize the lack of tolerance for travelling communities" },
                        { label: "D", value: "to highlight the current state of traditional travelling cultures" },
                    ],
                    correct_answer: "D",
                },
            ],
        },
    ],
};

const testB2_02: ExamSet = {
  id: "b2-reading-02",
  title: "Looking for a new Earth",
  title_uz: "Yangi Yer izlash",
  cefr_level: "B2",
  duration_minutes: 50,
  language: "en",
  parts: [
    {
  id: 1,
  title: "Part 1: Pompeii",
  title_uz: "Qism 1: Pompeii",
  description:
    "Read the text. Fill in each gap with ONE word. You must use a word which is somewhere in the rest of the text.",
  description_uz:
    "Matnni o‘qing va har bir bo‘sh joyni BIR so‘z bilan to‘ldiring.",
  passage: `POMPEII

The only active volcano on mainland Europe is Mount Vesuvius, situated on the west coast of Italy, just east of Naples, and most well-known for its eruption in the year 79 A.D. destroying the cities of Pompeii and Herculaneum. Mount Vesuvius has erupted about 50 times, but its most famous _________________ took place in 79 A.D. when it destroyed the city of Pompeii. It quickly buried the city in volcanic ash and preserved the life of this Ancient Roman city. The people of Pompeii didn’t know that Mount Vesuvius was a _________________and in fact there wasn’t even a word for volcano in Latin as they were not aware of their existence until _________________ erupted. The dead bodies remained in a semi-curled position, quickly buried in _________________ and preserved for hundreds of years. Following the eruption, Pliny also witnessed the sea retreating as if pushed by the _________________. In 1748, Pompeii was discovered by a group of explorers seeking _________________ artifacts.`,
  questions: [
    {
      id: 1,
      type: "GAP_FILL",
      text: "Mount Vesuvius has erupted about 50 times, but its most famous _________________ took place in 79 A.D. when it destroyed the city of Pompeii.",
      word_limit: 1,
      correct_answer: "eruption",
    },
    {
      id: 2,
      type: "GAP_FILL",
      text: "The people of Pompeii didn’t know that Mount Vesuvius was a _________________and in fact",
      word_limit: 1,
      correct_answer: "volcano",
    },
    {
      id: 3,
      type: "GAP_FILL",
      text: "there wasn’t even a word for volcano in Latin as they were not aware of their existence until _________________ erupted.",
      word_limit: 1,
      correct_answer: "Vesuvius",
    },
    {
      id: 4,
      type: "GAP_FILL",
      text: "The dead bodies remained in a semi-curled position, quickly buried in _________________ and preserved for hundreds of years.",
      word_limit: 1,
      correct_answer: "ash",
    },
    {
      id: 5,
      type: "GAP_FILL",
      text: "Following the eruption, Pliny also witnessed the sea retreating as if pushed by the _________________.",
      word_limit: 1,
      correct_answer: "earthquake",
    },
    {
      id: 6,
      type: "GAP_FILL",
      text: "In 1748, Pompeii was discovered by a group of explorers seeking _________________ artifacts.",
      word_limit: 1,
      correct_answer: "ancient",
    },
  ],
    },
    {
    id: 2,
    title: "Part 2: Art Courses & Films",
    title_uz: "Qism 2: San’at Kurslari va Filmlar",
    description:
        "The people all want to attend a course or watch a film. Read the descriptions and decide which option is most suitable.",
    description_uz:
        "Odamlar kursga yozilmoqchi yoki film tomosha qilmoqchi. Tavsiflarni o‘qing va eng mos variantni tanlang.",
    passage: `A. Wild Art
    This course concentrates on teaching drawing and painting, and you'll use your new skills to make a wall poster on the theme of animals, to take home. And we've got lots of picture books from galleries around the world to give you ideas! There'll be an exhibition of everyone's work at the end, too.

    B. Colourscape
    Come and make a bag to keep your school games clothes in! We supply lots of colourful wool and printed cotton - you choose the design and colour (like your favourite football or hockey team colours!). There'll also be a trip to a gallery to help you get creative in your designs.

    C. Create!
    This course is all about telling good stories in pictures. There'll be cartoon films to watch, and instruction in how to draw your favourite characters - but your imagination is much more important than your drawing skills here! The course includes a visit to a cartoon museum.

    D. Art Attack
    You'll work on developing creative skills, like printing, photography. cartoons and movie-making, using the latest technology. This course is great for anyone wanting to take these subjects at college. Good drawing skills are helpful on this course, and students' work will be put into a book, where suitable, for everyone to buy.
    E. Art Matters
    This course will concentrate on different drawing techniques, including using inks and colour. We'll get you to draw live models wearing designer fashions and sportswear — so if you like designing fashion and think your future is in this area, then this course is for you!

    F. Art Magic
    This fun course shows you how to design and make fashion jewellery from natural materials, and particularly how to use photography to help you get ideas for your
    designs. So if you have your own camera, bring it along!

    G. Arts Contr.
    Ever wondered what your comic stories would look like on film? Here's your chance to find out! Bring along your own comic drawings or prints - good-quality ones if possible - and we'll transfer the action from your page onto the screen! Film show of the best cartoons at the end!

    H. Rainbow
    Bring along a clean white T-shirt for this fun course! Using printing inks and paints, we'll show you how to transfer a picture onto your T-shirt and create a special artwork that you can put on for everyone to admire!

    I. Imagining
    While you're watching this beautiful film, you'll also be entertained by the wonderful piano and violin music that accompanies it. It's a film for the whole family. including young children, to sit down and see together. And everyone will find that they have something in common with the people in the film.

    J. Terry
    The pop music in this film is great, as it features the voices of top performers. The film follows a friendly tiger in the jungle, who becomes a hero to his friends. This film first came out in the 70s, and the graphics in this beautiful film have changed very little.

    K. Rainbow
    The whole family will sing along to the songs by well-known performers in this film. Choose which of the characters is most like you — and who's your hero! From the book by teenagers’ author Dylan Peters, it's been a favourite with audiences since it came out years ago.

    L. Constanz
    This beautiful film. with simple graphics, is based on the well-known novel. which has become very popular in school classrooms. Although it's full of comedy situations and surprises from beginning to end, the film also has a serious message. and will leave you with something to think about after you've watched it.`,
    questions: [
        {
        id: 7,
        type: "TEXT_MATCH",
        text: "7. Alice wants a course to help her with her drawing skills, particularly with drawing the latest styles of clothes, shoes and bags, because she wants to study this later at college.",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
            { label: "J", value: "J" },
            { label: "K", value: "K" },
            { label: "L", value: "L" },
        ],
        correct_answer: "E",
        },
        {
        id: 8,
        type: "TEXT_MATCH",
        text: "8. Darius loves making comic books, but isn't confident about his drawing. He wants to draw superheroes and animals and create adventures about them, but doesn't want to display his work.",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
            { label: "J", value: "J" },
            { label: "K", value: "K" },
            { label: "L", value: "L" },
        ],
        correct_answer: "C",
        },
        {
        id: 9,
        type: "TEXT_MATCH",
        text: "9. Cassie enjoys making pictures and objects from different materials. During the course she'd like to use her love of sport in her designs, and visit an exhibition to get new ideas.",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
            { label: "J", value: "J" },
            { label: "K", value: "K" },
            { label: "L", value: "L" },
        ],
        correct_answer: "B",
        },
        {
        id: 10,
        type: "TEXT_MATCH",
        text: "10.Marc is talented at drawing, but also likes filming his friends on an old digital camera. He wants to develop this skill by learning to use more advanced equipment, and prepare for further study.",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
            { label: "J", value: "J" },
            { label: "K", value: "K" },
            { label: "L", value: "L" },
        ],
        correct_answer: "D",
        },
        {
        id: 11,
        type: "TEXT_MATCH",
        text: "11.Harry has done a course about printing on paper, and would like to learn how to print on other materials. He also wants to produce something to take home and wear.",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
            { label: "J", value: "J" },
            { label: "K", value: "K" },
            { label: "L", value: "L" },
        ],
        correct_answer: "H",
        },
        {
        id: 12,
        type: "TEXT_MATCH",
        text: "12.Kerim wants a film that uses traditional animation methods, such as simple drawings rather than computers to create pictures. He particularly enjoys films about animals, and with great songs sung by well-known singers.",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
            { label: "J", value: "J" },
            { label: "K", value: "K" },
            { label: "L", value: "L" },
        ],
        correct_answer: "J",
        },
        {
        id: 13,
        type: "TEXT_MATCH",
        text: "13.Alice. her mum and small sister want a film they can all enjoy. Alice loves films where she feels the main characters are like her, and that have soundtracks involving only instruments, with no singing.",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
            { label: "J", value: "J" },
            { label: "K", value: "K" },
            { label: "L", value: "L" },
        ],
        correct_answer: "I",
        },
        {
        id: 14,
        type: "TEXT_MATCH",
        text: "14.Lukas enjoys films that make him laugh, but that he can learn something from at the same time. He's a keen reader, and he'd like a film of something he's probably already read.",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
            { label: "J", value: "J" },
            { label: "K", value: "K" },
            { label: "L", value: "L" },
        ],
        correct_answer: "L",
        },
    ],
    },
    {
    id: 3,
    title: "Part 3: The Honey Bee",
    title_uz: "Qism 3: Asalari",
    description:
        "Read the text and choose the correct heading for each paragraph. There are more headings than paragraphs.",
    description_uz:
        "Matnni o‘qing va har bir paragraf uchun to‘g‘ri sarlavhani tanlang. Ortiqcha sarlavhalar bor.",
    passage: `THE HONEY BEE
    1. The western honey bee or European honey bee (Apis mellifera) is the most common of the 7-12 species of honey bee worldwide. The genus name Apis is Latin for "bee", and mellifera is the Latin for "honey-bearing", referring to the species' production of honey for the winter.

    2. Human beings have been collecting honey from bees for thousands of years, with evidence in the form of rock art found in France and Spain, dating to around 7000 BC. The honey bee is one of the few invertebrate animals to have been domesticated. Humans collected wild honey in the Palaeolithic or Mesolithic periods, with evidence from rock art from France and Spain around 8,000 years old. Bees were likely first domesticated in ancient Egypt, where tomb paintings depict bee-keeping. Europeans brought bees to North America in 1622.

    3. Similar to all honey bees, the western honey bee is eusociol, creating colonies with a single fertile female (or "queen"), many normally non-reproductive females or "workers," and a small proportion of fertile males or "drones." Individual colonies can house tens of thousands of bees. Colony activities are organised by complex communication between individuals, through both pheromones and the dance language.

    4. Interestingly, the honey bee was one of the first domesticated insects, and it is the primary species maintained by beekeepers to this day for both its honey production and pollination activities. With human assistance, the western honey bee now occupies every continent except Antarctica. Because of its wide cultivation, this species is the single most important pollinator for agriculture globally.

    5. The western honey bee can be found on every continent except Antarctica. The species is believed to have originated in Africa or Asia, and spread naturally through Africa, the Middle East and Europe. Humans are responsible for its considerable additional range, introducing European subspecies into North America (early 1600s), South America, Australia, New Zealand, and East Asia.

    6. Western honey bees are an important model organism in scientific studies, particularly in the fields of social evolution, learning, and memory. They are also used in studies of pesticide toxicity to assess non-target impacts of commercial pesticides.`,
    questions: [
        {
        id: 15,
        type: "HEADINGS_MATCH",
        text: "15. Paragraph 1",
        options: [
            { label: "A) The hierarchy of the bee colony", value: "A" },
            { label: "B) The importance to farming worldwide", value: "B" },
            { label: "C) The origins of the name", value: "C" },
            { label: "D) The life cycle of an individual", value: "D" },
            { label: "E) Harvesting honey", value: "E" },
            { label: "F) Domesticating the bee", value: "F" },
            { label: "G) The distribution and habitat of bees", value: "G" },
            { label: "H) Usefulness in research", value: "H" },
            { label: "I) Protein and liquid consumption", value: "I" },
        ],
        correct_answer: "C",
        },
        {
        id: 16,
        type: "HEADINGS_MATCH",
        text: "16. Paragraph 2",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
        ],
        correct_answer: "F",
        },
        {
        id: 17,
        type: "HEADINGS_MATCH",
        text: "17. Paragraph 3",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
        ],
        correct_answer: "A",
        },
        {
        id: 18,
        type: "HEADINGS_MATCH",
        text: "18. Paragraph 4",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
        ],
        correct_answer: "B",
        },
        {
        id: 19,
        type: "HEADINGS_MATCH",
        text: "19. Paragraph 5",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
        ],
        correct_answer: "G",
        },
        {
        id: 20,
        type: "HEADINGS_MATCH",
        text: "20. Paragraph 6",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
            { label: "D", value: "D" },
            { label: "E", value: "E" },
            { label: "F", value: "F" },
            { label: "G", value: "G" },
            { label: "H", value: "H" },
            { label: "I", value: "I" },
        ],
        correct_answer: "H",
        },
    ],
    },
    {
      id: 4,
      title: "Part 4: An Introduction to Film Sound",
      title_uz: "Qism 4: Marqalar",
      description: "Read the text and answer questions 21-29.",
      description_uz: "Matnni o'qing va 21-29 savollarni javob bering.",
      passage: `
Though we might think of film as an essentially visual experience, we really cannot afford to underestimate the importance of film sound. A meaningful sound track is often as complicated as the image on the screen, and is ultimately just as much the responsibility of the director. The entire sound track consists of three essential ingredients: the human voice, sound effects and music. These three tracks must be mixed and balanced so as to produce the necessary emphases which in turn create desired effects.

Topics which essentially refer to the three previously mentioned tracks are discussed below. They include dialogue, synchronous and asynchronous sound effects, and music.

Let us start with dialogue. As is the case with stage drama, dialogue serves to tell the story and expresses feelings and motivations of characters as well. Often with film characterization the audience perceives little or no difference between the character and the actor. Thus, for example, the actor Humphrey Bogart is the character Sam Spade; film personality and life personality seem to merge. Perhaps this is because the very texture of a performer's voice supplies an element of character.

When voice textures fit the performer's physiognomy and gestures, a whole and very realistic persona emerges. The viewer sees not an actor working at his craft, but another human being struggling with life. It is interesting to note that how dialogue is used and the very amount of dialogue used varies widely among films. For example, in the highly successful science-fiction film 2001, little dialogue was evident, and most of it was banal and of little intrinsic interest. In this way the film-maker was able to portray what Thomas Sobochack and Vivian Sobochack call, in An Introduction to Film, the 'inadequacy of human responses when compared with the magnificent technology created by man and the visual beauties of the universe'.

The comedy Bringing Up Baby, on the other hand, presents practically non-stop dialogue delivered at breakneck speed. This use of dialogue underscores not only the dizzy quality of the character played by Katherine Hepburn, but also the absurdity of the film itself and thus its humor. The audience is bounced from gag to gag and conversation to conversation; there is no time for audience reflection. The audience is caught up in a whirlwind of activity in simply managing to follow the plot. This film presents pure escapism - largely due to its frenetic dialogue.

Synchronous sound effects are those sounds which are synchronized or matched with what is viewed. For example, if the film portrays a character playing the piano, the sounds of the piano are projected. Synchronous sounds contribute to the realism of film and also help to create a particular atmosphere. For example, the 'click' of a door being opened may simply serve to convince the audience that the image portrayed is real, and the audience may only subconsciously note the expected sound.

However, if the 'click' of an opening door is part of an ominous action such as a burglary, the sound mixer may call attention to the 'click' with an increase in volume; this helps to engage the audience in a moment of suspense.

Asynchronous sound effects, on the other hand, are not matched with a visible source of the sound on screen. Such sounds are included so as to provide an appropriate emotional nuance, and they may also add to the realism of the film. For example, a film-maker might opt to include the background sound of an ambulance's siren while the foreground sound and image portrays an arguing couple. The asynchronous ambulance siren underscores the psychic injury incurred in the argument; at the same time the noise of the siren adds to the realism of the film by acknowledging the film's city setting.

We are probably all familiar with background music in films, which has become so ubiquitous as to be noticeable in its absence. We are aware that it is used to add emotion and rhythm. Usually not meant to be noticeable, it often provides a tone or an emotional attitude toward the story and /or the characters depicted. In addition, background music often foreshadows a change in mood. For example, dissonant music may be used in film to indicate an approaching (but not yet visible) menace or disaster. Background music may aid viewer understanding by linking scenes. For example, a particular musical theme associated with an individual character or situation may be repeated at various points in a film in order to remind the audience of salient motifs or ideas.

Film sound comprises conventions and innovations. We have come to expect an acceleration of music during car chases and creaky doors in horror films. Yet, it is important to note as well that sound is often brilliantly conceived. The effects of sound are often largely subtle and often are noted by only our subconscious minds. We need to foster an awareness of film sound as well as film space so as to truly appreciate an art form that sprang to life during the twentieth century - the modern film.`,
      questions: [
        {
          id: 21,
          type: "MULTIPLE_CHOICE",
          text: "In the first paragraph, the writer makes a point that",
          options: [
            { label: "A", value: "the director should plan the sound track at an early stage in filming." },
            { label: "B", value: "it would be wrong to overlook the contribution of sound to the artistry of films." },
            { label: "C", value: "the music industry can have a beneficial influence on sound in film." },
            { label: "D", value: "it is important for those working on the sound in a film to have sole responsibility for it" },
          ],
          correct_answer: "B",
        },
        {
          id: 22,
          type: "MULTIPLE_CHOICE",
          text: "One reason that the writer refers to Humphrey Bogart is to exemplify",
          options: [
            { label: "A", value: "the importance of the actor and the character appearing to have similar personalities." },
            { label: "B", value: "the audience’s wish that actors are visually appropriate for their roles." },
            { label: "C", value: "the value of the actor having had similar feelings to the character" },
            { label: "D", value: "the audience’s preference for dialogue to be as authentic as possible." },
          ],
          correct_answer: "A",
        },
        {
          id: 23,
          type: "MULTIPLE_CHOICE",
          text: "In the third paragraph, the writer suggests that",
          options: [
            { label: "A", value: "audiences are likely to be critical of film dialogue that does not reflect their own experience." },
            { label: "B", value: "film dialogue that appears to be dull may have a specific purpose." },
            { label: "C", value: "filmmakers vary considerably in the skill with which they handle dialogue." },
            { label: "D", value: "the most successful films are those with dialogue of a high Quality." },
          ],
          correct_answer: "B",
        },
        {
          id: 24,
          type: "MULTIPLE_CHOICE",
          text: "What does the writer suggest about Bringing Up",
          options: [
            { label: "A", value: "The plot suffers from the filmmaker’s wish to focus on humorous dialogue." },
            { label: "B", value: "The dialogue helps to make it one of the best comedy films ever produced." },
            { label: "C", value: "There is a mismatch between the speed of the dialogue and the speed of actions" },
            { label: "D", value: "The nature of the dialogue emphasises key elements of the film." },
          ],
          correct_answer: "D",
        },
        {
        id: 25,
          type: "MULTIPLE_CHOICE",
          text: "The writer refers to the ‘click’ of a door to make the point that realistic sounds",
          options: [
            { label: "A", value: "are often used to give the audience a false impression of events in the film." },
            { label: "B", value: "may be interpreted in different ways by different members of the audience." },
            { label: "C", value: "may be modified in order to manipulate the audience’s response to the film." },
            { label: "D", value: "tend to be more significant in films presenting realistic situations." },
          ],
          correct_answer: "C",
        },
        {
          id: 26,
          type: "TRUE_FALSE_NOT_GIVEN",
          text: "Audiences are likely to be surprised if a film lacks background music.",
          correct_answer: "TRUE",
        },
        {
          id: 27,
          type: "TRUE_FALSE_NOT_GIVEN",
          text: "Background music may anticipate a development in a film.",
          correct_answer: "TRUE",
        },
        {
          id: 28,
          type: "TRUE_FALSE_NOT_GIVEN",
          text: "Background music has more effect on some people than on others.",
          correct_answer: "NOT GIVEN",
        },
        {
          id: 29,
          type: "TRUE_FALSE_NOT_GIVEN",
          text: "Background music may help the audience to make certain connections within the film.",
          correct_answer: "TRUE",
        },
      ],
    },
    {
      id: 5,
      title: "Part 5: Biology of Bitterness",
      title_uz: "Qism 5: Biology of Bitterness",
      description: "Read the text and answer questions 30-35.",
      description_uz: "Matnni o'qing va 30-35 savollarni javob bering.",
      passage: `Biology of Bitterness
To many people, grapefruit is palatable only when doused in sugar. Bitter Blockers like adenosine monophosphate could change that.

There is a reason why grapefruit juice is served in little glasses: most people don’t want to drink more than a few ounces at a time. aringin, a natural chemical compound found in grapefruit, tastes bitter. Some people like that bitterness in small doses and believe it enhances the general flavor, but others would rather avoid it altogether. So juice packagers often select grapefruit with low naringin though the compound has antioxidant properties that some nutritionists contend may help prevent cancer and arteriosclerosis.

It is possible, however, to get the goodness of grapefruit juice without the bitter taste. I found that out by participating in a test conducted at the Linguagen Corporation, a biotechnology company in Cranbury, New Jersey. Sets of two miniature white paper cups, labeled 304and 305, were placed before five people seated around a conference table. Each of us drank from one cup and then the other, cleansing our palates between tastes with water and a soda cracker. Even the smallest sip of 304 had grapefruit ‘s unmistakable bitter bite. But 305 was smoother; there was the sour taste of citrus but none of the bitterness of naringin. This juice had been treated with adenosine monophosphate, or AMP, a compound that blocks the bitterness in foods without making them less nutritious.

Taste research is a booming business these days, with scientists delving into all five basicssweet, bitter, sour, salty, and umami, the savory taste of protein. Bitterness is of special interest to industry because of its untapped potential in food. There are thousands of bitter -tasting compounds in nature. They defend plants by warning animals away and protect animals by letting them know when a plant may be poisonous. But the system isn’t foolproof. Grapefruit and cruciferous vegetable like Brussels sprouts and kale are nutritious despite-and sometimes because of-their bitter-tasting components. Over time, many people have learned to love them, at least in small doses. “Humans are the only species that enjoys bitter taste,” says Charles Zuker, a neuroscientist at the University of California School of Medicine at San Diego. “Every other species is averse to bitter because it means bad news. But we have learned to enjoy it. We drink coffee, which is bitter, and quinine [in tonic water] too. We enjoy having that spice in our lives.” Because bitterness can be pleasing in small quantities but repellent when intense, bitter blockers like AMP could make a whole range of foods, drinks, and medicines more palatable-and therefore more profitable.

People have varying capacities for tasting bitterness, and the differences appear to be genetic. About 75 percent of people are sensitive to the taste of the bitter compounds phenylthiocarbamide and 6-n-propylthiouracil. and 25 percent are insensitive. Those who are sensitive to phenylthiocarbamide seem to be less likely than others to eat cruciferous vegetables, according to Stephen Wooding, a geneticist at the University of Utah. Some people, known as supertasters, are especially sensitive to 6-n-propylthiouraci because they have an unusually high number of taste buds. Supertasters tend to shun all kinds of bittertasting things, including vegetable, coffee, and dark chocolate. Perhaps as a result, they tend to be thin. They’re also less fond of alcoholic drinks, which are often slightly bitter. Dewar’s scotch, for instance, tastes somewhat sweet to most people. ” But a supertaster tastes no sweetness at all, only bitterness,” says Valerie Duffy, an associate professor of dietetics at the University of Connecticut at Storrs.

In one recent study, Duffy found that supertasters consume alcoholic beverages, on average, only two to three times a week, compared with five or six times for the average nontasters. Each taste bud, which looks like an onion, consists of 50 to 100 elongated cells running from the top of the bud to the bottom. At the top is a little clump of receptors that capture the taste molecules, known as tastants, in food and drink. The receptors function much like those for sight and smell. Once a bitter signal has been received, it is relayed via proteins known as G proteins. The G protein involved in the perception of bitterness, sweetness, and umami was identified in the early 1990s by Linguagen’s founder, Robert Margolskee, at Mount Sinai School of Medicine in New York City. Known as gustducin, the protein triggers a cascade of chemical reactions that lead to changes in ion concentrations within the cell. Ultimately, this delivers a signal to the brain that registers as bitter. “The signaling system is like a bucket brigade,” Margolskee says. “It goes from the G protein to other proteins.”
In 2000 Zuker and others found some 30 different kinds of genes that code for bitter-taste receptors. “We knew the number would have to be large because there is such a large universe of bitter tastants,” Zuker says. Yet no matter which tastant enters the mouth or which receptor it attaches to, bitter always tastes the same to us. The only variation derives from its intensity and the ways in which it can be flavored by the sense of smell. “Taste cells are like a light switch,” Zuker says. “They are either on or off.”

Once they figured put the taste mechanism, scientists began to think of ways to interfere with it. They tried AMP, an organic compound found in breast milk and other substances, which is created as cells break down food. Amp has no bitterness of its own, but when put it in foods, Margolskee and his colleagues discovered, it attaches to bitter-taste receptors. As effective as it is, AMP may not be able to dampen every type pf bitter taste, because it probably doesn’t attach to all 30 bitter-taste receptors. So Linguagen has scaled up the hunt for other bitter blockers with a technology called high-throughput screening. Researchers start by coaxing cells in culture to activate bitter-taste receptors. Then candidate substances, culled from chemical compound libraries, are dropped onto the receptors, and scientists look for evidence of a reaction.

Tin time, some taste researchers believe, compounds like AMP will help make processed foods less unhealthy. Consider, for example, that a single cup of Campbell’s chicken noodle soup contains 850 milligrams of sodium chloride, or table salt-more than a third of the recommended daily allowance. The salt masks the bitterness created by the high temperatures used in the canning process, which cause sugars and amino acids to react. Part of the salt could be replaced by another salt, potassium chloride, which tends to be scarce in some people’s diets. Potassium chloride has a bitter aftertaste, but that could be eliminated with a dose of AMP. Bitter blockers could also be used in place of cherry or grape flavoring to take the harshness out of children’s cough syrup, and they could dampen the bitterness of antihistamines, antibiotics, certain HIV drugs, and other medications.

A number of foodmakers have already begun to experiment with AMP in their products, and other bitter blockers are being developed by rival firms such as Senomyx in La Jolla, California. In a few years, perhaps, after food companies have taken the bitterness from canned soup and TV dinners, they can set their sights on something more useful: a bitter blocker in a bottle that any of us can sprinkle on our brussels sprouts or stir into our grapefruit juice. `,
      questions: [
        {
          id: 30,
          type: "GAP_FILL",
          text: "The reason why grapefruit tastes bitter is because a substance called  _____________ contained in it.",
          word_limit: 1,
          correct_answer: "naringin",
        },
        {
          id: 31,
          type: "GAP_FILL",
          text: " However, bitterness plays a significant role for plants. It gives a signal that certain plant is _____________.",
          word_limit: 1,
          correct_answer: "poisonus",
        },
        {
          id: 32,
          type: "GAP_FILL",
          text: "For human beings, different person carries various genetic abilities of tasting bitterness. According to a scientist at the University of Utah, _____________",
          word_limit: 1,
          correct_answer: "supertasters",
        },
        {
          id: 33,
          type: "GAP_FILL",
          text: "have exceptionally plenty of _____________, which allows them to perceive bitter compounds.",
          word_limit: 1,
          correct_answer: "tastebuds",
        },
        {
          id: 34,
          type: "MULTIPLE_CHOICE",
          text: "What is the main feature of AMP according to this passage?",
          options: [
            { label: "A", value: "offset bitter flavour in food" },
            { label: "B", value: "only exist in 304 cup" },
            { label: "C", value: "tastes like citrus" },
            { label: "D", value: "chemical reaction when meets biscuit" },
          ],
          correct_answer: "A",
        },
        {
          id: 35,
          type: "MULTIPLE_CHOICE",
          text: "What is the main function of G protein?",
          options: [
            { label: "A", value: "collecting taste molecule" },
            { label: "B", value: "identifying different flavors elements" },
            { label: "C", value: "resolving large molecules" },
            { label: "D", value: "transmitting bitter signals to the brain" },
          ],
          correct_answer: "D",
        },
      ],
    },
  ],
};

// 2. Barcha testlarni bitta "Collection"ga yig'amiz
export const allReadingTests: Record<string, ExamSet> = {
  "b2-01": testB2_01,
  "b2-02": testB2_02,
};

// Sahifalar uchun massiv ko'rinishi
export const READING_EXAMS_LIST = Object.values(allReadingTests);

// Eskicha importlar xato bermasligi uchun bittasini default qoldiring
export const readingExamRaw = testB2_01;