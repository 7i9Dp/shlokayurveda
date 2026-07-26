import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from 'src/app/_interface/product';
import { ProductBookingService } from 'src/app/_services/productbooking.service';
import Swal from 'sweetalert2';
declare const $: any;

export interface contactusModel {
  name: any;
  phone: any;
  email: any;
  address: any;
  concern: any;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  data: any = [];
  selectedProduct: any;
  selectedProductName: any;
  submitted: boolean = false;
  submitbtn: boolean = false;
  products: ProductModel;
  ID: any;
  quantity: any;
  userForm: FormGroup;
  contactForm: FormGroup;
  contactus: contactusModel;
  viewBox: string = '0 0 100 100';
  // x: string = '-26';
  submitbtnc: boolean = false;
  submitbtnu: boolean = false;
  feedbacks: any = [];
  displayFeedbacks: any[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateViewBox();
  }

  private updateViewBox() {
    this.viewBox = window.innerWidth <= 768 ? '0 11 100 85' : '0 0 100 100';
    // this.x = window.innerWidth <= 768 ? '-12' : '-26';
  }

  constructor(private fb: FormBuilder, private ProductBookingService: ProductBookingService) {
    this.userForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      email: ['', [Validators.required, Validators.email]], // Added email validator
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', Validators.required],
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', Validators.required],
      address: ['', Validators.required],
      concern: ['', Validators.required],
    });

    this.contactus = {
      name: '',
      phone: '',
      email: '',
      address: '',
      concern: ''
    }

    this.products = {
      id: 0,
      productid: 0,
      productname: '',
      pack: '',
      quantity: 0,
      email: '',
      phone: '',
      name: '',
      address: '',
      pincode: '',
      include: '',
      price: 0,
      oldPrice: 0,
      usefor: '',
      duration: '',
      total: 0,
      IsKit: false
    };
  }
  ngOnInit(): void {
    this.updateViewBox();
    this.data = [
      {
        "id": 10,
        "imagePath": "../../../assets/img/Home/60 - STRONG JOSH CAPSULE.jpg",
        "imagePath2": "../../../assets/img/Home/STRONGJOSH 30-02.jpeg",
        "productName": "STRONGJOSH BOOSTER CAPTULE",
        "pack": "60 CAPSULE PACK",
        "price": "1099",
        "oldPrice": "1399",
        "IsKit": false
      },
      {
        "id": 11,
        "imagePath": "../../../assets/img/Home/60 - WILD- X CAPSULE.jpg",
        "imagePath2": "../../../assets/img/Home/WILD X 30.jpg",
        "productName": "WILD-X CAPSULE",
        "pack": "60 CAPSULE PACK",
        "price": "1499",
        "oldPrice": "1799",
        "IsKit": false
      },
      {
        "id": 12,
        "imagePath": "../../../assets/img/Home/HARD - X SPRAY.jpg",
        "imagePath2": "../../../assets/img/Home/HARD-X WHITE 2-02.jpeg",
        "productName": "DOUBLE HARD SPRAY",
        "pack": "30 ml",
        "price": "799",
        "oldPrice": "999",
        "IsKit": false
      },
      {
        "id": 13,
        "imagePath": "../../../assets/img/Home/CONSTIBEST POWDER.jpg",
        "imagePath2": "../../../assets/img/Home/Constibest Mockup.jpg",
        "productName": "COSTIBEST POWDER",
        "pack": "100 gm",
        "price": "699",
        "oldPrice": "799",
        "IsKit": false
      },
      {
        "id": 14,
        "imagePath": "../../../assets/img/Home/GASOLEFT CAPSULE.jpg",
        "imagePath2": "../../../assets/img/Home/GASOLEFT CAPS WHITE-02.jpeg",
        "productName": "GASOLEFT CAPSULES",
        "pack": "30 CAPSULES",
        "price": "499",
        "oldPrice": null,
        "IsKit": false
      },
      {
        "id": 15,
        "imagePath": "../../../assets/img/Home/PILOLEX CAPSULE.jpg",
        "imagePath2": "../../../assets/img/Home/Pilolex Mockup.jpg",
        "productName": "PILOLEX CAPSULE",
        "pack": "30 CAPSULE PACK",
        "price": "599",
        "oldPrice": null,
        "IsKit": false
      },
      {
        "id": 16,
        "imagePath": "../../../assets/img/Home/WILD X CAPSULE.jpg",
        "imagePath2": "../../../assets/img/Home/WILD X 30.jpg",
        "productName": "WILD-X CAPSULE",
        "pack": "30 CAPSULE PACK",
        "price": "799",
        "oldPrice": "999",
        "IsKit": false
      },
      {
        "id": 17,
        "imagePath": "../../../assets/img/Home/STRONG JOSH BOOSTER CAPSULE .jpg",
        "imagePath2": "../../../assets/img/Home/STRONGJOSH 30-02.jpeg",
        "productName": "STRONGJOSH BOOSTER CAPTULES",
        "pack": "30 CAPSULE PACK",
        "price": "699",
        "oldPrice": "799",
        "IsKit": false
      }
    ]

    this.feedbacks = [
      // ---------- English ----------
      {
        name: "Rajesh Mahajan",
        review: "StrongJosh Booster has honestly made a difference. I don't feel tired by evening anymore. Happy with the purchase."
      },
      {
        name: "Manu Prajapati",
        review: "Wild-X Capsule worked better than I expected. Started noticing improvement after a few weeks."
      },
      {
        name: "Anish Soni",
        review: "Double Hard Spray is easy to use and gives good results. Worth trying."
      },
      {
        name: "Anish Patel",
        review: "Constibest Powder solved my constipation problem naturally. No discomfort now."
      },
      {
        name: "Ravi Sharma",
        review: "Gasoleft Capsules helped me a lot with acidity. I can finally eat without worrying."
      },
      {
        name: "Deepak Kumar",
        review: "Pilolex Capsules gave me relief within a few weeks. Very satisfied."
      },
      {
        name: "Sandeep Verma",
        review: "Good quality Ayurvedic medicines. Packaging was also nice."
      },
      {
        name: "Nikhil Shah",
        review: "StrongJosh Booster is now part of my daily routine. Feeling much more active."
      },
      {
        name: "Amit Mehta",
        review: "Ordered Wild-X Capsule after a friend's recommendation. Happy with the results."
      },
      {
        name: "Karan Joshi",
        review: "Delivery was quick and the medicine seems genuine. Will order again."
      },

      // ---------- Hindi ----------
      {
        name: "राकेश यादव",
        review: "मैंने StrongJosh Booster लगभग एक महीने तक लिया। पहले की तुलना में अब काफी ज्यादा ऊर्जा महसूस होती है।"
      },
      {
        name: "सुनील शर्मा",
        review: "Wild-X Capsule का असर धीरे-धीरे दिखा लेकिन परिणाम अच्छे मिले। मैं संतुष्ट हूँ।"
      },
      {
        name: "विकास चौहान",
        review: "Double Hard Spray इस्तेमाल करने में आसान है और मुझे इसका अच्छा फायदा मिला।"
      },
      {
        name: "महेश वर्मा",
        review: "Constibest Powder लेने के बाद पेट साफ रहने लगा। अब पहले जैसी परेशानी नहीं होती।"
      },
      {
        name: "अजय सिंह",
        review: "Gasoleft Capsule से गैस और एसिडिटी में काफी आराम मिला। अब खाना खाने में डर नहीं लगता।"
      },
      {
        name: "पंकज मिश्रा",
        review: "Pilolex Capsule लेने के बाद काफी राहत मिली। आयुर्वेदिक इलाज पर भरोसा और बढ़ गया।"
      },
      {
        name: "दीपक चौधरी",
        review: "दवा की क्वालिटी अच्छी लगी। कोई साइड इफेक्ट महसूस नहीं हुआ।"
      },
      {
        name: "सुरेश गुप्ता",
        review: "StrongJosh Booster लेने के बाद शरीर में पहले से ज्यादा ताकत महसूस होती है।"
      },
      {
        name: "रोहित अग्रवाल",
        review: "Wild-X Capsule का रिजल्ट मेरे लिए अच्छा रहा। दोबारा जरूर ऑर्डर करूँगा।"
      },
      {
        name: "मुकेश तिवारी",
        review: "Shlok Ayurveda की दवाइयाँ भरोसेमंद लगीं। समय पर डिलीवरी भी मिली।"
      },
      {
        name: "अमित सक्सेना",
        review: "Constibest Powder ने मेरी पुरानी कब्ज की समस्या में काफी मदद की।"
      },
      {
        name: "नरेश पाल",
        review: "Gasoleft Capsule लेने के बाद पेट हल्का रहता है। मुझे अच्छा अनुभव रहा।"
      },
      {
        name: "धर्मेंद्र यादव",
        review: "StrongJosh Booster लेने के बाद कमजोरी पहले से काफी कम महसूस होती है।"
      },
      {
        name: "मनोज पांडे",
        review: "मैंने Pilolex Capsule अपने दोस्त की सलाह पर लिया था। रिजल्ट अच्छा रहा।"
      },
      {
        name: "अरविंद शर्मा",
        review: "दवा की पैकिंग अच्छी थी और असर भी उम्मीद के अनुसार मिला।"
      },

      // ---------- Gujarati ----------
      {
        name: "હર્ષ પટેલ",
        review: "StrongJosh Booster લીધા પછી શરીરમાં પહેલા કરતા વધારે તાકાત અનુભવાઈ. મને સારો અનુભવ રહ્યો."
      },
      {
        name: "નિરવ શાહ",
        review: "Gasoleft Capsule લીધા પછી ગેસ અને અપચાની તકલીફ ઘણી ઓછી થઈ ગઈ."
      },
      {
        name: "સાગર પરમાર",
        review: "Constibest Powder ખરેખર સારું છે. હવે પેટ નિયમિત રીતે સાફ રહે છે."
      },
      {
        name: "કેતન જોષી",
        review: "Double Hard Spray નો ઉપયોગ સરળ છે અને પરિણામ પણ સારું મળ્યું."
      },
      {
        name: "ભાવેશ પટેલ",
        review: "Wild-X Capsule લીધા પછી ધીમે ધીમે સારો ફેરફાર અનુભવાયો."
      },
      {
        name: "મહેશ ઠાકોર",
        review: "StrongJosh Booster મારા માટે ખૂબ ઉપયોગી રહ્યું. હવે દિવસભર થાક ઓછો લાગે છે."
      },
      {
        name: "ધવલ મહેતા",
        review: "આ દવા લીધા પછી આત્મવિશ્વાસમાં વધારો થયો છે. મને ગમ્યું."
      },
      {
        name: "પ્રકાશ સોલંકી",
        review: "Pilolex Capsule થી ઘણી રાહત મળી. આયુર્વેદિક દવા હોવાથી વિશ્વાસ પણ રહ્યો."
      },
      {
        name: "મિતેશ દેસાઈ",
        review: "Gasoleft Capsule લીધા પછી જમ્યા પછી થતી બળતરા લગભગ બંધ થઈ ગઈ."
      },
      {
        name: "હાર્દિક વસાવા",
        review: "Constibest Powder નો સ્વાદ પણ ચાલે એવો છે અને પરિણામ પણ સારું મળ્યું."
      },
      {
        name: "યશ પટેલ",
        review: "Wild-X Capsule વિશે સાંભળીને મંગાવી હતી. હવે નિયમિત રીતે લઈ રહ્યો છું."
      },
      {
        name: "ચિરાગ શાહ",
        review: "StrongJosh Booster લીધા પછી શરીરમાં સ્ફૂર્તિ અનુભવાઈ. મને સંતોષ થયો."
      },
      {
        name: "અંકિત પટેલ",
        review: "દવાની પેકિંગ સારી હતી અને સમયસર ડિલિવરી મળી."
      },
      {
        name: "મયુર જોષી",
        review: "Double Hard Spray નો અનુભવ સારો રહ્યો. ફરીથી ઓર્ડર કરીશ."
      },
      {
        name: "સાગર પરીખ",
        review: "Shlok Ayurveda ની દવાઓ પર વિશ્વાસ છે. અત્યાર સુધીનો અનુભવ સારો રહ્યો."
      }
    ];

    this.displayFeedbacks = this.feedbacks.slice(0, 4);

    this.shuffleFeedbacks();
  }

  Buynow(product: any) {
    this.selectedProduct = product;
    $("#productModal").modal('toggle');
  }

  shuffleFeedbacks() {
  this.displayFeedbacks = [...this.feedbacks]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
}

  get f() { return this.contactForm.controls; }
  get uf() { return this.userForm.controls; }

  updateQuantity(event: any): void {
    this.quantity = event.target.value;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    else {
      this.submitbtn = true;
      this.products.id = this.ID || 0;
      this.products.productid = this.selectedProduct.id;
      this.products.productname = this.selectedProduct.productName;
      this.products.pack = this.selectedProduct.pack;
      this.products.quantity = this.userForm.value.quantity;
      this.products.email = this.userForm.value.email;
      this.products.phone = this.userForm.value.phone;
      this.products.name = this.userForm.value.name;
      this.products.address = this.userForm.value.address;
      this.products.pincode = this.userForm.value.pincode;
      this.products.price = this.selectedProduct.price;
      this.products.total = (this.userForm.value.quantity) * (this.selectedProduct.price);
      this.products.IsKit = this.selectedProduct.IsKit;
      this.ProductBookingService.insertProduct(this.products).subscribe(
        res => {
          if (res.isSuccess) {
            Swal.fire('', res.returnMessage, 'success');
          }
          else {
            Swal.fire('', res.returnMessage, 'error');
          }
          $("#productModal").modal('toggle');
          this.resetForm();
        },
        err => {
          Swal.fire('', err.error.message, 'error');
        }
      );
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.submitbtn = false;
    this.userForm.reset();
    this.quantity = 1;
    this.userForm.get('quantity')?.setValue(1);
  }

  onSubmitContactUs(): void {
    debugger
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    } else {
      debugger
      this.submitbtnc = true;
      this.contactus.name = this.contactForm.value.name,
        this.contactus.phone = this.contactForm.value.phone,
        this.contactus.email = this.contactForm.value.email,
        this.contactus.address = this.contactForm.value.address,
        this.contactus.concern = this.contactForm.value.concern
      this.ProductBookingService.insertContactUSDetails(this.contactus).subscribe(
        res => {
          if (res.isSuccess) {
            Swal.fire(
              'Thank you for reaching out!',
              'Your request has been submitted successfully. Our team will get in touch within 24 hours. Stay tuned!',
              'success'
            );
            this.resetContact();
          } else {
            Swal.fire('Error', res.returnMessage, 'error');
          }

        },
        err => {
          Swal.fire('Error', err.error.message, 'error');
        }
      );
    }
  }

  resetContact() {
    this.submitted = false;
    this.submitbtnc = false;
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      concern: ['', Validators.required],
    });
  }
}
