(function() {
/**
 * Zen Register - Order Guide
 * Vendor catalog, purchase orders, and inventory receiving
 */

// ============================================
// Vendor Catalog - Five Core Vendors
// ============================================
const vendorCatalog = {
    CB: {
        id: 'CB', name: 'Cascade Beverage Co.', category: 'Drinks', color: '#3498db',
        items: {
            CB001: { name: 'Spring Water 16oz',             cost: 0.35, price: 1.25, unit: 'each' },
            CB002: { name: 'Spring Water 24oz',             cost: 0.55, price: 1.75, unit: 'each' },
            CB003: { name: 'Sparkling Water 12oz',          cost: 0.65, price: 1.99, unit: 'each' },
            CB004: { name: 'Cola 12oz Can',                 cost: 0.45, price: 1.50, unit: 'each' },
            CB005: { name: 'Diet Cola 12oz Can',            cost: 0.45, price: 1.50, unit: 'each' },
            CB006: { name: 'Cola 20oz Bottle',              cost: 0.75, price: 2.25, unit: 'each' },
            CB007: { name: 'Lemon-Lime Soda 12oz',          cost: 0.45, price: 1.50, unit: 'each' },
            CB008: { name: 'Orange Soda 12oz',              cost: 0.45, price: 1.50, unit: 'each' },
            CB009: { name: 'Root Beer 12oz',                cost: 0.45, price: 1.50, unit: 'each' },
            CB010: { name: 'Ginger Ale 12oz',               cost: 0.45, price: 1.50, unit: 'each' },
            CB011: { name: 'Orange Juice 12oz',             cost: 0.80, price: 2.49, unit: 'each' },
            CB012: { name: 'Apple Juice 10oz',              cost: 0.60, price: 1.99, unit: 'each' },
            CB013: { name: 'Cranberry Juice 15oz',          cost: 0.90, price: 2.75, unit: 'each' },
            CB014: { name: 'Grape Juice 10oz',              cost: 0.70, price: 2.25, unit: 'each' },
            CB015: { name: 'Lemonade 20oz',                 cost: 0.75, price: 2.25, unit: 'each' },
            CB016: { name: 'Pink Lemonade 20oz',            cost: 0.75, price: 2.25, unit: 'each' },
            CB017: { name: 'Iced Tea 18oz',                 cost: 0.80, price: 2.49, unit: 'each' },
            CB018: { name: 'Sweet Tea 18oz',                cost: 0.80, price: 2.49, unit: 'each' },
            CB019: { name: 'Peach Tea 18oz',                cost: 0.80, price: 2.49, unit: 'each' },
            CB020: { name: 'Green Tea 18oz',                cost: 0.85, price: 2.75, unit: 'each' },
            CB021: { name: 'Energy Drink 16oz',             cost: 1.20, price: 3.49, unit: 'each' },
            CB022: { name: 'Energy Drink Sugar-Free 16oz',  cost: 1.20, price: 3.49, unit: 'each' },
            CB023: { name: 'Sports Drink Blue 20oz',        cost: 0.70, price: 2.25, unit: 'each' },
            CB024: { name: 'Sports Drink Red 20oz',         cost: 0.70, price: 2.25, unit: 'each' },
            CB025: { name: 'Sports Drink Orange 20oz',      cost: 0.70, price: 2.25, unit: 'each' },
            CB026: { name: 'Coconut Water 11oz',            cost: 1.00, price: 2.99, unit: 'each' },
            CB027: { name: 'Flavored Water Strawberry 16oz',cost: 0.55, price: 1.75, unit: 'each' },
            CB028: { name: 'Flavored Water Peach 16oz',     cost: 0.55, price: 1.75, unit: 'each' },
            CB029: { name: 'Cold Brew Coffee 11oz',         cost: 1.50, price: 3.99, unit: 'each' },
            CB030: { name: 'Canned Latte 11oz',             cost: 1.40, price: 3.75, unit: 'each' },
            CB031: { name: 'Chocolate Milk 14oz',           cost: 0.85, price: 2.49, unit: 'each' },
            CB032: { name: 'Whole Milk 8oz',                cost: 0.45, price: 1.50, unit: 'each' },
            CB033: { name: 'Kombucha Original 16oz',        cost: 1.20, price: 3.49, unit: 'each' },
            CB034: { name: 'Kombucha Ginger 16oz',          cost: 1.20, price: 3.49, unit: 'each' },
            CB035: { name: 'Vitamin Water 20oz',            cost: 0.90, price: 2.75, unit: 'each' },
            CB036: { name: 'Aloe Vera Drink 16oz',          cost: 1.00, price: 2.99, unit: 'each' },
            CB037: { name: 'Mango Nectar 12oz',             cost: 0.75, price: 2.25, unit: 'each' },
            CB038: { name: 'Pineapple Juice 12oz',          cost: 0.75, price: 2.25, unit: 'each' },
            CB039: { name: 'Soda Water 12oz',               cost: 0.40, price: 1.25, unit: 'each' },
            CB040: { name: 'Tonic Water 12oz',              cost: 0.50, price: 1.50, unit: 'each' }
        }
    },
    SS: {
        id: 'SS', name: 'Sweet Street Confections', category: 'Candy', color: '#e74c3c',
        items: {
            SS001: { name: 'Milk Chocolate Bar 1.5oz',      cost: 0.55, price: 1.49, unit: 'each' },
            SS002: { name: 'Dark Chocolate Bar 1.5oz',      cost: 0.65, price: 1.75, unit: 'each' },
            SS003: { name: 'Peanut Butter Cups 1.6oz',      cost: 0.60, price: 1.59, unit: 'each' },
            SS004: { name: 'Caramel Chocolate Bites 2oz',   cost: 0.70, price: 1.99, unit: 'each' },
            SS005: { name: 'Almond Chocolate Bar 1.5oz',    cost: 0.65, price: 1.75, unit: 'each' },
            SS006: { name: 'Gummy Bears 2oz',               cost: 0.45, price: 1.25, unit: 'each' },
            SS007: { name: 'Gummy Worms 2oz',               cost: 0.45, price: 1.25, unit: 'each' },
            SS008: { name: 'Gummy Peach Rings 2oz',         cost: 0.50, price: 1.39, unit: 'each' },
            SS009: { name: 'Gummy Cola Bottles 2oz',        cost: 0.50, price: 1.39, unit: 'each' },
            SS010: { name: 'Gummy Sharks 2oz',              cost: 0.50, price: 1.39, unit: 'each' },
            SS011: { name: 'Sour Worms 2oz',                cost: 0.50, price: 1.49, unit: 'each' },
            SS012: { name: 'Sour Patch Kids 1.8oz',         cost: 0.55, price: 1.49, unit: 'each' },
            SS013: { name: 'Sour Gummy Belts 2oz',          cost: 0.55, price: 1.49, unit: 'each' },
            SS014: { name: 'Hard Candy Assorted 2oz',       cost: 0.35, price: 0.99, unit: 'each' },
            SS015: { name: 'Butterscotch Candies 2oz',      cost: 0.35, price: 0.99, unit: 'each' },
            SS016: { name: 'Peppermint Candies 2oz',        cost: 0.35, price: 0.99, unit: 'each' },
            SS017: { name: 'Fruit Drops 2oz',               cost: 0.40, price: 1.09, unit: 'each' },
            SS018: { name: 'Cinnamon Discs 2oz',            cost: 0.40, price: 1.09, unit: 'each' },
            SS019: { name: 'Lollipop Assorted 3-pack',      cost: 0.30, price: 0.99, unit: 'pack' },
            SS020: { name: 'Lollipop Strawberry 3-pack',    cost: 0.30, price: 0.99, unit: 'pack' },
            SS021: { name: 'Candy Corn 2oz',                cost: 0.40, price: 1.09, unit: 'each' },
            SS022: { name: 'Licorice Twists Red 2oz',       cost: 0.45, price: 1.29, unit: 'each' },
            SS023: { name: 'Licorice Twists Black 2oz',     cost: 0.45, price: 1.29, unit: 'each' },
            SS024: { name: 'Caramels Wrapped 3oz',          cost: 0.60, price: 1.59, unit: 'each' },
            SS025: { name: 'Taffy Assorted 3oz',            cost: 0.55, price: 1.49, unit: 'each' },
            SS026: { name: 'Rock Candy Stick',              cost: 0.40, price: 1.25, unit: 'each' },
            SS027: { name: 'Candy Necklace',                cost: 0.25, price: 0.99, unit: 'each' },
            SS028: { name: 'Candy Buttons Strip',           cost: 0.20, price: 0.75, unit: 'each' },
            SS029: { name: 'Wax Lips',                      cost: 0.25, price: 0.75, unit: 'each' },
            SS030: { name: 'Nerds Box 1.65oz',              cost: 0.45, price: 1.25, unit: 'each' },
            SS031: { name: 'Jawbreaker 4-pack',             cost: 0.40, price: 1.09, unit: 'pack' },
            SS032: { name: 'Bubble Gum Tape',               cost: 0.35, price: 0.99, unit: 'each' },
            SS033: { name: 'Bubble Gum Balls 4oz',          cost: 0.45, price: 1.25, unit: 'each' },
            SS034: { name: 'Mint Chocolates 1.5oz',         cost: 0.65, price: 1.75, unit: 'each' },
            SS035: { name: 'White Chocolate Bar 1.5oz',     cost: 0.60, price: 1.59, unit: 'each' },
            SS036: { name: 'Toffee Bar 1.4oz',              cost: 0.60, price: 1.59, unit: 'each' },
            SS037: { name: 'Fudge Square 2oz',              cost: 0.75, price: 1.99, unit: 'each' },
            SS038: { name: 'Marshmallow Chicks',            cost: 0.30, price: 0.89, unit: 'each' },
            SS039: { name: 'Swedish Fish 1.8oz',            cost: 0.50, price: 1.39, unit: 'each' },
            SS040: { name: 'Starburst Pack 2oz',            cost: 0.55, price: 1.49, unit: 'each' },
            SS041: { name: 'Skittles Pack 2oz',             cost: 0.55, price: 1.49, unit: 'each' },
            SS042: { name: 'M&M Milk Chocolate 1.7oz',      cost: 0.60, price: 1.59, unit: 'each' },
            SS043: { name: 'M&M Peanut 1.7oz',              cost: 0.60, price: 1.59, unit: 'each' },
            SS044: { name: 'Spree Roll 1.8oz',              cost: 0.45, price: 1.25, unit: 'each' },
            SS045: { name: 'Pixie Stix 5-pack',             cost: 0.30, price: 0.89, unit: 'pack' }
        }
    },
    GC: {
        id: 'GC', name: 'Golden Crust Bakery Supply', category: 'Bakery', color: '#f39c12',
        items: {
            GC001: { name: 'Blueberry Muffin',              cost: 0.75, price: 2.25, unit: 'each' },
            GC002: { name: 'Bran Muffin',                   cost: 0.65, price: 1.99, unit: 'each' },
            GC003: { name: 'Chocolate Chip Muffin',         cost: 0.75, price: 2.25, unit: 'each' },
            GC004: { name: 'Lemon Poppy Muffin',            cost: 0.75, price: 2.25, unit: 'each' },
            GC005: { name: 'Banana Nut Muffin',             cost: 0.70, price: 2.10, unit: 'each' },
            GC006: { name: 'Croissant Plain',               cost: 0.65, price: 2.00, unit: 'each' },
            GC007: { name: 'Croissant Chocolate',           cost: 0.85, price: 2.50, unit: 'each' },
            GC008: { name: 'Croissant Almond',              cost: 0.90, price: 2.75, unit: 'each' },
            GC009: { name: 'Plain Bagel',                   cost: 0.45, price: 1.50, unit: 'each' },
            GC010: { name: 'Everything Bagel',              cost: 0.50, price: 1.75, unit: 'each' },
            GC011: { name: 'Cinnamon Raisin Bagel',         cost: 0.50, price: 1.75, unit: 'each' },
            GC012: { name: 'Sesame Bagel',                  cost: 0.45, price: 1.50, unit: 'each' },
            GC013: { name: 'Sourdough Roll',                cost: 0.50, price: 1.75, unit: 'each' },
            GC014: { name: 'Dinner Roll',                   cost: 0.30, price: 0.99, unit: 'each' },
            GC015: { name: 'Brioche Roll',                  cost: 0.60, price: 1.99, unit: 'each' },
            GC016: { name: 'White Sandwich Bread Loaf',     cost: 1.50, price: 3.99, unit: 'loaf' },
            GC017: { name: 'Wheat Sandwich Bread Loaf',     cost: 1.65, price: 4.25, unit: 'loaf' },
            GC018: { name: 'Sourdough Loaf',                cost: 2.00, price: 5.50, unit: 'loaf' },
            GC019: { name: 'Rye Bread Loaf',                cost: 1.75, price: 4.75, unit: 'loaf' },
            GC020: { name: 'Chocolate Chip Cookie',         cost: 0.45, price: 1.50, unit: 'each' },
            GC021: { name: 'Sugar Cookie',                  cost: 0.35, price: 1.25, unit: 'each' },
            GC022: { name: 'Snickerdoodle Cookie',          cost: 0.40, price: 1.35, unit: 'each' },
            GC023: { name: 'Oatmeal Raisin Cookie',         cost: 0.40, price: 1.35, unit: 'each' },
            GC024: { name: 'Peanut Butter Cookie',          cost: 0.45, price: 1.50, unit: 'each' },
            GC025: { name: 'Double Chocolate Cookie',       cost: 0.50, price: 1.75, unit: 'each' },
            GC026: { name: 'Glazed Donut',                  cost: 0.55, price: 1.75, unit: 'each' },
            GC027: { name: 'Chocolate Frosted Donut',       cost: 0.60, price: 1.99, unit: 'each' },
            GC028: { name: 'Jelly Donut',                   cost: 0.60, price: 1.99, unit: 'each' },
            GC029: { name: 'Cinnamon Sugar Donut',          cost: 0.55, price: 1.75, unit: 'each' },
            GC030: { name: 'Donut Hole 6-pack',             cost: 0.80, price: 2.49, unit: 'pack' },
            GC031: { name: 'Cheese Danish',                 cost: 0.70, price: 2.25, unit: 'each' },
            GC032: { name: 'Apple Danish',                  cost: 0.75, price: 2.25, unit: 'each' },
            GC033: { name: 'Cinnamon Roll',                 cost: 0.85, price: 2.75, unit: 'each' },
            GC034: { name: 'Pecan Roll',                    cost: 0.90, price: 2.99, unit: 'each' },
            GC035: { name: 'Brownie',                       cost: 0.70, price: 2.25, unit: 'each' },
            GC036: { name: 'Lemon Bar',                     cost: 0.65, price: 2.10, unit: 'each' },
            GC037: { name: 'Blondie Bar',                   cost: 0.65, price: 2.10, unit: 'each' },
            GC038: { name: 'Slice of Pound Cake',           cost: 0.75, price: 2.25, unit: 'each' },
            GC039: { name: 'Banana Bread Slice',            cost: 0.70, price: 2.25, unit: 'each' },
            GC040: { name: 'Zucchini Bread Slice',          cost: 0.65, price: 2.10, unit: 'each' },
            GC041: { name: 'Pita Bread 4-pack',             cost: 0.90, price: 2.75, unit: 'pack' },
            GC042: { name: 'English Muffin 4-pack',         cost: 1.00, price: 3.25, unit: 'pack' }
        }
    },
    FR: {
        id: 'FR', name: 'FreshRoute Produce', category: 'Produce', color: '#27ae60',
        items: {
            FR001: { name: 'Apple Fuji',                    cost: 0.35, price: 0.99, unit: 'each' },
            FR002: { name: 'Apple Gala',                    cost: 0.35, price: 0.99, unit: 'each' },
            FR003: { name: 'Apple Granny Smith',            cost: 0.35, price: 0.99, unit: 'each' },
            FR004: { name: 'Banana',                        cost: 0.15, price: 0.49, unit: 'each' },
            FR005: { name: 'Orange Navel',                  cost: 0.40, price: 1.09, unit: 'each' },
            FR006: { name: 'Orange Blood',                  cost: 0.50, price: 1.25, unit: 'each' },
            FR007: { name: 'Clementine',                    cost: 0.30, price: 0.89, unit: 'each' },
            FR008: { name: 'Lemon',                         cost: 0.25, price: 0.75, unit: 'each' },
            FR009: { name: 'Lime',                          cost: 0.20, price: 0.65, unit: 'each' },
            FR010: { name: 'Grapefruit',                    cost: 0.55, price: 1.49, unit: 'each' },
            FR011: { name: 'Peach',                         cost: 0.50, price: 1.25, unit: 'each' },
            FR012: { name: 'Nectarine',                     cost: 0.50, price: 1.25, unit: 'each' },
            FR013: { name: 'Plum',                          cost: 0.45, price: 1.09, unit: 'each' },
            FR014: { name: 'Pear',                          cost: 0.45, price: 1.25, unit: 'each' },
            FR015: { name: 'Strawberries Pint',             cost: 1.50, price: 3.99, unit: 'pint' },
            FR016: { name: 'Blueberries Pint',              cost: 2.00, price: 4.99, unit: 'pint' },
            FR017: { name: 'Raspberries Half Pint',         cost: 1.75, price: 3.99, unit: 'half pt' },
            FR018: { name: 'Blackberries Half Pint',        cost: 1.75, price: 3.99, unit: 'half pt' },
            FR019: { name: 'Grapes Red Seedless 1lb',       cost: 1.20, price: 2.99, unit: 'lb' },
            FR020: { name: 'Grapes Green Seedless 1lb',     cost: 1.10, price: 2.75, unit: 'lb' },
            FR021: { name: 'Watermelon Slice',              cost: 0.80, price: 2.25, unit: 'each' },
            FR022: { name: 'Cantaloupe Slice',              cost: 0.70, price: 1.99, unit: 'each' },
            FR023: { name: 'Mango',                         cost: 0.60, price: 1.75, unit: 'each' },
            FR024: { name: 'Pineapple Chunk Cup',           cost: 1.00, price: 2.75, unit: 'each' },
            FR025: { name: 'Kiwi',                          cost: 0.35, price: 0.99, unit: 'each' },
            FR026: { name: 'Avocado',                       cost: 0.70, price: 1.75, unit: 'each' },
            FR027: { name: 'Tomato on Vine',                cost: 0.45, price: 1.25, unit: 'each' },
            FR028: { name: 'Cucumber',                      cost: 0.40, price: 1.09, unit: 'each' },
            FR029: { name: 'Carrot Bag 1lb',                cost: 0.75, price: 1.99, unit: 'bag' },
            FR030: { name: 'Celery Bunch',                  cost: 0.90, price: 2.49, unit: 'each' },
            FR031: { name: 'Broccoli Crown',                cost: 0.90, price: 2.49, unit: 'each' },
            FR032: { name: 'Romaine Heart',                 cost: 0.75, price: 2.25, unit: 'each' },
            FR033: { name: 'Spinach Bag 5oz',               cost: 1.00, price: 2.99, unit: 'bag' },
            FR034: { name: 'Bell Pepper Red',               cost: 0.65, price: 1.75, unit: 'each' },
            FR035: { name: 'Bell Pepper Green',             cost: 0.45, price: 1.25, unit: 'each' },
            FR036: { name: 'Zucchini',                      cost: 0.50, price: 1.39, unit: 'each' },
            FR037: { name: 'Corn on Cob',                   cost: 0.40, price: 1.09, unit: 'each' },
            FR038: { name: 'Jalapeño 3-pack',               cost: 0.25, price: 0.75, unit: 'pack' },
            FR039: { name: 'Fresh Herbs Basil',             cost: 0.90, price: 2.49, unit: 'each' },
            FR040: { name: 'Fresh Herbs Mint',              cost: 0.90, price: 2.49, unit: 'each' }
        }
    },
    MS: {
        id: 'MS', name: 'MedShelf Distribution', category: 'Over the Counter', color: '#9b59b6',
        items: {
            MS001: { name: 'Aspirin 24ct',                  cost: 1.00, price: 3.49, unit: 'each' },
            MS002: { name: 'Ibuprofen 24ct',                cost: 1.10, price: 3.75, unit: 'each' },
            MS003: { name: 'Acetaminophen 24ct',            cost: 0.95, price: 3.49, unit: 'each' },
            MS004: { name: 'Naproxen Sodium 12ct',          cost: 1.20, price: 3.99, unit: 'each' },
            MS005: { name: 'Antacid Chewable 12ct',         cost: 0.80, price: 2.75, unit: 'each' },
            MS006: { name: 'Antacid Liquid 12oz',           cost: 1.50, price: 4.99, unit: 'each' },
            MS007: { name: 'Heartburn Relief 14ct',         cost: 1.40, price: 4.75, unit: 'each' },
            MS008: { name: 'Anti-Diarrheal 12ct',           cost: 1.25, price: 4.25, unit: 'each' },
            MS009: { name: 'Allergy Tablets 14ct',          cost: 1.50, price: 4.99, unit: 'each' },
            MS010: { name: 'Non-Drowsy Allergy 10ct',       cost: 1.60, price: 5.25, unit: 'each' },
            MS011: { name: 'Nasal Decongestant 18ct',       cost: 1.30, price: 4.49, unit: 'each' },
            MS012: { name: 'Nasal Spray 0.5oz',             cost: 1.75, price: 5.99, unit: 'each' },
            MS013: { name: 'Cough Drops Honey 18ct',        cost: 0.80, price: 2.75, unit: 'each' },
            MS014: { name: 'Cough Drops Cherry 18ct',       cost: 0.80, price: 2.75, unit: 'each' },
            MS015: { name: 'Cough Syrup 4oz',               cost: 1.80, price: 5.99, unit: 'each' },
            MS016: { name: 'Throat Lozenges 16ct',          cost: 1.00, price: 3.49, unit: 'each' },
            MS017: { name: 'Cold & Flu Capsules 20ct',      cost: 1.75, price: 5.75, unit: 'each' },
            MS018: { name: 'Nighttime Cold & Flu 20ct',     cost: 1.90, price: 6.25, unit: 'each' },
            MS019: { name: 'Bandages Assorted 20ct',        cost: 0.90, price: 3.25, unit: 'each' },
            MS020: { name: 'Bandages Large 10ct',           cost: 0.85, price: 2.99, unit: 'each' },
            MS021: { name: 'Gauze Pads 4x4 10ct',           cost: 1.00, price: 3.49, unit: 'each' },
            MS022: { name: 'Medical Tape 1in Roll',         cost: 0.75, price: 2.75, unit: 'each' },
            MS023: { name: 'Antiseptic Wipes 10ct',         cost: 0.80, price: 2.99, unit: 'each' },
            MS024: { name: 'Hydrogen Peroxide 4oz',         cost: 0.60, price: 2.49, unit: 'each' },
            MS025: { name: 'Rubbing Alcohol 4oz',           cost: 0.55, price: 2.25, unit: 'each' },
            MS026: { name: 'Antibiotic Ointment 1oz',       cost: 1.00, price: 3.75, unit: 'each' },
            MS027: { name: 'Hydrocortisone Cream 1oz',      cost: 1.10, price: 3.99, unit: 'each' },
            MS028: { name: 'Hand Sanitizer 2oz',            cost: 0.70, price: 2.49, unit: 'each' },
            MS029: { name: 'Hand Sanitizer 8oz',            cost: 1.50, price: 4.99, unit: 'each' },
            MS030: { name: 'Sunscreen SPF 30 2oz',          cost: 1.50, price: 4.99, unit: 'each' },
            MS031: { name: 'Sunscreen SPF 50 2oz',          cost: 1.75, price: 5.75, unit: 'each' },
            MS032: { name: 'Lip Balm SPF 15',               cost: 0.60, price: 2.25, unit: 'each' },
            MS033: { name: 'Eye Drops Dry Eye 0.5oz',       cost: 1.25, price: 4.25, unit: 'each' },
            MS034: { name: 'Saline Nasal Rinse 4oz',        cost: 1.00, price: 3.49, unit: 'each' },
            MS035: { name: 'Vitamin C 500mg 30ct',          cost: 1.50, price: 4.99, unit: 'each' },
            MS036: { name: 'Vitamin D3 1000IU 30ct',        cost: 1.25, price: 4.25, unit: 'each' },
            MS037: { name: 'Zinc Tablets 30ct',             cost: 1.10, price: 3.75, unit: 'each' },
            MS038: { name: 'Melatonin 5mg 30ct',            cost: 1.75, price: 5.75, unit: 'each' },
            MS039: { name: 'Electrolyte Packets 6ct',       cost: 1.20, price: 3.99, unit: 'each' },
            MS040: { name: 'Cold/Hot Pack Reusable',        cost: 1.50, price: 4.99, unit: 'each' }
        }
    }
};

// ============================================
// Order Guide Working State (ephemeral - not persisted)
// ============================================

// ============================================
// Vendor PLU Translation
// Alphanumeric vendor codes → numeric register PLUs
// CB001 → 01001,  SS042 → 02042,  etc.
// ============================================
const VENDOR_PLU_PREFIX = {
    CB: '01',   // Cascade Beverage Co.      (Drinks)
    SS: '02',   // Sweet Street Confections  (Candy)
    GC: '03',   // Golden Crust Bakery       (Bakery)
    FR: '04',   // FreshRoute Produce        (Produce)
    MS: '05'    // MedShelf Distribution     (OTC)
};

function translateCode(vendorId, vendorCode) {
    const prefix = VENDOR_PLU_PREFIX[vendorId] || '99';
    const suffix  = vendorCode.replace(/^[A-Z]+/, ''); // strip letters, keep digits
    return prefix + suffix;  // e.g. '01' + '001' = '01001'
}

const orderGuideState = {
    selectedVendorId: null,
    currentOrder: {}   // itemCode → { ...itemData, vendorId, quantity }
};

// ============================================
// Wire up DOM elements for Order Guide
// (runs after app.js has set up the elements object)
// ============================================
elements.btnOrderGuide    = document.getElementById('btnOrderGuide');
elements.orderGuideModal  = document.getElementById('orderGuideModal');
elements.orderGuideClose  = document.getElementById('orderGuideClose');
elements.vendorList       = document.getElementById('vendorList');
elements.catalogVendorName= document.getElementById('catalogVendorName');
elements.catalogSearch    = document.getElementById('ogCatalogSearch');
elements.catalogTableBody = document.getElementById('catalogTableBody');
elements.orderCartVendor  = document.getElementById('orderCartVendor');
elements.orderCartItems   = document.getElementById('orderCartItems');
elements.orderCartTotal   = document.getElementById('orderCartTotal');
elements.orderCartCount   = document.getElementById('orderCartCount');
elements.btnReceiveOrder  = document.getElementById('btnReceiveOrder');
elements.btnClearOrder    = document.getElementById('btnClearOrder');

elements.btnOrderGuide.addEventListener('click', openOrderGuideModal);
elements.orderGuideClose.addEventListener('click', closeOrderGuideModal);
elements.orderGuideModal.addEventListener('click', (e) => {
    if (e.target === elements.orderGuideModal) closeOrderGuideModal();
});
elements.catalogSearch.addEventListener('input', filterCatalog);
elements.btnReceiveOrder.addEventListener('click', receiveOrder);
elements.btnClearOrder.addEventListener('click', clearOrder);

// ============================================
// Order Guide Functions
// ============================================

function openOrderGuideModal() {
    renderVendorSidebar();
    elements.orderGuideModal.classList.add('active');
}

function closeOrderGuideModal() {
    elements.orderGuideModal.classList.remove('active');
}

function renderVendorSidebar() {
    elements.vendorList.innerHTML = Object.values(vendorCatalog).map(vendor => `
        <div class="vendor-item ${orderGuideState.selectedVendorId === vendor.id ? 'active' : ''}"
             onclick="selectVendor('${vendor.id}')"
             style="--vendor-color:${vendor.color}">
            <div class="vendor-item-dot" style="background:${vendor.color}"></div>
            <div class="vendor-item-info">
                <div class="vendor-item-name">${vendor.name}</div>
                <div class="vendor-item-category">${vendor.category}</div>
            </div>
            <div class="vendor-item-count">${Object.keys(vendor.items).length}</div>
        </div>
    `).join('');
}

function selectVendor(vendorId) {
    orderGuideState.selectedVendorId = vendorId;
    const vendor = vendorCatalog[vendorId];
    renderVendorSidebar();
    elements.catalogVendorName.textContent = vendor.name + ' \u2014 ' + vendor.category;
    elements.catalogSearch.disabled = false;
    elements.catalogSearch.value = '';
    renderCatalog(Object.entries(vendor.items).map(([code, item]) => ({ code, ...item })));
}

function filterCatalog() {
    if (!orderGuideState.selectedVendorId) return;
    const vendor = vendorCatalog[orderGuideState.selectedVendorId];
    const q = elements.catalogSearch.value.toLowerCase().trim();
    const all = Object.entries(vendor.items).map(([code, item]) => ({ code, ...item }));
    renderCatalog(q ? all.filter(i => i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q)) : all);
}

function renderCatalog(items) {
    if (!items.length) {
        elements.catalogTableBody.innerHTML = '<tr><td colspan="7" class="catalog-empty">No items match your search</td></tr>';
        return;
    }
    elements.catalogTableBody.innerHTML = items.map(item => {
        const inOrder = orderGuideState.currentOrder[item.code];
        const qty = inOrder ? inOrder.quantity : 0;
        return `<tr class="${qty > 0 ? 'catalog-row-ordered' : ''}">
            <td class="catalog-code" title="Vendor: ${item.code}">${translateCode(orderGuideState.selectedVendorId, item.code)}</td>
            <td class="catalog-name">${item.name}</td>
            <td class="catalog-unit">${item.unit}</td>
            <td class="catalog-cost">$${item.cost.toFixed(2)}</td>
            <td class="catalog-price">$${item.price.toFixed(2)}</td>
            <td class="catalog-qty-cell">
                <input type="number" class="catalog-qty-input" id="qty_${item.code}"
                       value="${qty}" min="0" step="1"
                       onchange="updateOrderItem('${item.code}', this.value)">
            </td>
            <td>
                <button class="catalog-add-btn ${qty > 0 ? 'active' : ''}"
                        onclick="quickAddItem('${item.code}')">
                    ${qty > 0 ? '\u2713' : '+'}
                </button>
            </td>
        </tr>`;
    }).join('');
}

function quickAddItem(itemCode) {
    const current = orderGuideState.currentOrder[itemCode];
    const newQty = current ? current.quantity + 1 : 1;
    updateOrderItem(itemCode, newQty);
    filterCatalog();
}

function updateOrderItem(itemCode, rawQty) {
    const qty = parseInt(rawQty, 10) || 0;
    const vendorId = orderGuideState.selectedVendorId;
    if (!vendorId) return;
    const vendor = vendorCatalog[vendorId];
    const itemData = vendor.items[itemCode];
    if (!itemData) return;
    if (qty <= 0) {
        delete orderGuideState.currentOrder[itemCode];
    } else {
        orderGuideState.currentOrder[itemCode] = { ...itemData, code: itemCode, vendorId, vendorName: vendor.name, quantity: qty };
    }
    updateOrderCart();
}

function removeOrderItem(itemCode) {
    delete orderGuideState.currentOrder[itemCode];
    updateOrderCart();
    if (orderGuideState.selectedVendorId) filterCatalog();
}

function updateOrderCart() {
    const orderItems = Object.values(orderGuideState.currentOrder);
    if (!orderItems.length) {
        elements.orderCartItems.innerHTML = '<div class="order-cart-empty">No items added yet</div>';
        elements.orderCartTotal.textContent = '$0.00';
        elements.orderCartCount.textContent = '0';
        elements.orderCartVendor.textContent = 'No vendor selected';
        elements.btnReceiveOrder.disabled = true;
        return;
    }
    const vendorIds = [...new Set(orderItems.map(i => i.vendorId))];
    elements.orderCartVendor.textContent = vendorIds.map(id => vendorCatalog[id].name).join(', ');
    elements.orderCartItems.innerHTML = orderItems.map(item => `
        <div class="order-cart-item">
            <div class="order-cart-item-info">
                <span class="order-cart-item-name">${item.name}</span>
                <span class="order-cart-item-meta">${item.code} &middot; ${item.unit}</span>
            </div>
            <div class="order-cart-item-right">
                <span class="order-cart-item-qty">&times;${item.quantity}</span>
                <span class="order-cart-item-cost">$${roundCurrency(item.cost * item.quantity).toFixed(2)}</span>
                <button class="order-cart-remove" onclick="removeOrderItem('${item.code}')">&times;</button>
            </div>
        </div>`).join('');
    const total = roundCurrency(orderItems.reduce((s, i) => s + i.cost * i.quantity, 0));
    const units = orderItems.reduce((s, i) => s + i.quantity, 0);
    elements.orderCartTotal.textContent = formatCurrency(total);
    elements.orderCartCount.textContent = units;
    elements.btnReceiveOrder.disabled = false;
}

function clearOrder() {
    if (!Object.keys(orderGuideState.currentOrder).length) return;
    if (!confirm('Clear the current purchase order?')) return;
    orderGuideState.currentOrder = {};
    updateOrderCart();
    if (orderGuideState.selectedVendorId) filterCatalog();
}


function generateInvoiceHTML(orderItems, invoiceId, now) {
    const vendorIds   = [...new Set(orderItems.map(function(i) { return i.vendorId; }))];
    const vendorNames = vendorIds.map(function(id) { return vendorCatalog[id].name; }).join(', ');
    const totalCost   = roundCurrency(orderItems.reduce(function(s, i) { return s + i.cost * i.quantity; }, 0));
    const totalUnits  = orderItems.reduce(function(s, i) { return s + i.quantity; }, 0);

    const rows = orderItems.map(function(item) {
        return '<tr>' +
            '<td><strong>' + translateCode(item.vendorId, item.code) + '</strong></td>' +
            '<td>' + item.code + '</td>' +
            '<td>' + item.name + '</td>' +
            '<td>' + vendorCatalog[item.vendorId].name + '</td>' +
            '<td>' + item.unit + '</td>' +
            '<td class="pw-right">' + item.quantity + '</td>' +
            '<td class="pw-right">$' + item.cost.toFixed(2) + '</td>' +
            '<td class="pw-right">$' + roundCurrency(item.cost * item.quantity).toFixed(2) + '</td>' +
            '</tr>';
    }).join('');

    return '<div class="pw-doc-header">' +
        '<div class="pw-doc-title">PURCHASE INVOICE</div>' +
        '<div class="pw-doc-meta">' + invoiceId + '</div>' +
        '<div class="pw-doc-meta">' + now.toLocaleDateString() +
        ' &nbsp;&bull;&nbsp; ' + now.toLocaleTimeString() + '</div>' +
        '</div>' +
        '<div class="pw-section" style="margin:10px 0"><strong>Vendor(s):</strong> ' + vendorNames + '</div>' +
        '<table>' +
        '<thead><tr>' +
        '<th>PLU</th><th>Vendor Code</th><th>Item</th><th>Vendor</th><th>Unit</th>' +
        '<th class="pw-right">Qty</th><th class="pw-right">Unit Cost</th><th class="pw-right">Subtotal</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '<tfoot><tr class="pw-total-row">' +
        '<td colspan="5">' + orderItems.length + ' item(s), ' + totalUnits + ' unit(s)</td>' +
        '<td></td><td></td>' +
        '<td class="pw-right"><strong>$' + totalCost.toFixed(2) + '</strong></td>' +
        '</tr></tfoot>' +
        '</table>' +
        '<div class="pw-doc-footer">Zen Register \u2014 Inventory Record</div>';
}

function receiveOrder() {
    const orderItems = Object.values(orderGuideState.currentOrder);
    if (!orderItems.length) return;
    let newCount = 0, restockedCount = 0;
    orderItems.forEach(item => {
        const plu = translateCode(item.vendorId, item.code);
        if (productDatabase[plu]) {
            productDatabase[plu].stock += item.quantity;
            restockedCount++;
        } else {
            productDatabase[plu] = { name: item.name, price: item.price, stock: item.quantity };
            newCount++;
        }
    });
    // Generate and save purchase invoice
    const now = new Date();
    const invoiceId = 'INV-' + Date.now();
    if (typeof PW !== 'undefined') {
        const vendorIds   = [...new Set(orderItems.map(function(i) { return i.vendorId; }))];
        const vendorNames = vendorIds.map(function(id) { return vendorCatalog[id].name; }).join(', ');
        const totalCost   = roundCurrency(orderItems.reduce(function(s, i) { return s + i.cost * i.quantity; }, 0));
        PW.saveInvoice(generateInvoiceHTML(orderItems, invoiceId, now),
                       vendorNames, orderItems.length, totalCost, now);
    }
    saveToStorage();
    const parts = [
        newCount      ? newCount      + ' new product'  + (newCount > 1      ? 's' : '') + ' added'     : '',
        restockedCount? restockedCount + ' product'     + (restockedCount > 1 ? 's' : '') + ' restocked' : ''
    ].filter(Boolean);
    showNotification('Order received \u2014 ' + parts.join(', '), 'success');
    orderGuideState.currentOrder = {};
    updateOrderCart();
    if (orderGuideState.selectedVendorId) filterCatalog();
}

// ============================================
// Expose globals used in onclick handlers
// ============================================
window.selectVendor    = selectVendor;
window.updateOrderItem = updateOrderItem;
window.quickAddItem    = quickAddItem;
window.removeOrderItem = removeOrderItem;

})();
