import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tickettype } from 'src/app/_interface/tickettype';
import { TicketbookingService } from 'src/app/_services/ticketbooking.service';
import Swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-ticketbooking',
  templateUrl: './ticketbooking.component.html',
  styleUrls: ['./ticketbooking.component.css']
})
export class TicketbookingComponent implements OnInit {

  formTitle: string = "Ticket";
  TicketBookingForm: FormGroup;
  submitted = false;
  search: any = '';
  tickettypeData: any = [];
  ticketbookingfortodayData: any = [];
  tickettype: Tickettype;
  //or tickettype: Tickettype = {} as Tickettype;
  submitbtn: boolean = false;
  tid: number = 0;
  userid: any = 1;

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  BillData: any = [];
  Time: any;
  Date: any;

  total: number = 0;
  totalBill: number = 0;

  modifiedTicketUniqueId: any = '';
  modifiedTicketUnique: any = '';
  IdWiseData: any = [];

  //date wise filter
  fltTime: number = 0;
  timefilter: number = 0;
  startdate: string = '';
  enddate: string = '';

  selectedValuesString: any;
  groupDisabled: boolean = false;
  checked:boolean = false;

  constructor(private FB: FormBuilder, private ticketBookingService: TicketbookingService) {
    //this.userid = Number(localStorage.getItem('userId') || 0); 
    //// left
    this.TicketBookingForm = this.FB.group({
      // tickets: this.FB.array([])
      tickets: this.FB.array([this.addBill()])
    })

    this.tickettype = {
      tickettypeid: 0,
      tickettypename: '',
      ticketrate: 0,
      isactive: true,
      createdby: 0,
      ticketlist: [],
      groupOption: 0,
      total: 0
    };
  }

  ngOnInit(): void {
    this.getTicketType(this.search, this.pageIndex, this.pageSize);
    this.getTicketTypefortoday();
  }

  get tickets(): FormArray {
    return <FormArray>this.TicketBookingForm.get('tickets');
  }

  addMoreitem() {
    this.tickets.push(this.addBill());
  }
  deleteItem(index: number) {
    this.tickets.removeAt(index);
  }

  addBill(): FormGroup {
    return this.FB.group({
      tickettype: ['', Validators.required],
      ticketcounts: ['', Validators.required],
    })
  }

  setServer(ttickettype: any, tticketcounts: any): FormGroup {
    return this.FB.group({
      tickettype: [ttickettype],
      ticketcounts: [tticketcounts],
    })
  }

  openTicketBookingDialog() {
    this.submitted = false;
    this.submitbtn = false;
    this.tid = 0;
    this.resetForm();
    //this.frlable = "Add";

    for (let i = 0; i < 1; i++) {
      this.tickets.push(this.addBill());
    }
    $("#booking").modal('toggle');
  }

  onCancel() {
    this.resetForm();
  }

  get f() { return this.TicketBookingForm.controls; }

  // addUpdateTicketType(){
  //   this.submitted = true;
  //   if(this.TicketBookingForm.invalid){
  //     return;
  //   }

  addUpdateTicketBooking() {
    debugger
    this.submitted = true;
    if (this.TicketBookingForm.invalid) {
      return;
    }
    else {
      if (this.selectedValues > 0) {
        this.tickettype.groupOption = 1;
      }
      this.tickettype.tickettypeid = this.tid;
      this.submitbtn = true;
      this.tickettype.ticketlist = this.TicketBookingForm.value.tickets;
      this.tickettype.createdby = this.userid;
      this.tickettype.total = this.total;

      this.ticketBookingService.insertUpdateTicketBooking(this.tickettype).subscribe(
        res => {
          if (res.isSuccess) {
            this.BillData = res.data[0];
            debugger
            //this.modifiedTicketUnique = this.BillData.ticketuniqueid.replace(/-/g, '/');
            this.modifiedTicketUniqueId = this.BillData.ticketuniqueid;
            //this.modifiedTicketUniqueId = this.BillData.ticketuniqueid;

            this.IdWiseData = res.data;
            this.totalBill = res.data[0].total_rates;

            const timestamp = res.data[0].createddate;
            const dateAndTime = timestamp.slice(0, 16); // Extract "2023-09-19T15:49"
            const date = dateAndTime.slice(0, 10); // Extract "2023-09-19"
            const time = dateAndTime.slice(11); // Extract "15:49"

            const inputDate = new Date(date);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const day = inputDate.getDate();
            const month = monthNames[inputDate.getMonth()];
            const year = inputDate.getFullYear();
            this.Date = `${day} ${month} ${year}`;
            this.Time = time;
            //$("#QR").modal('toggle');
            debugger
            this.getTicketTypefortoday();

            setTimeout(() => {
              this.Print()
            }, 1000);

          }
          else {
            Swal.fire('', res.returnMessage, 'error');
          }
          $("#booking").modal('toggle');
        },
        err => {
          Swal.fire('', err.error.message, 'error');
        }
      );
    }
  }

  openQRDialog() {
    $("#QR").modal('toggle');
  }

  Print() {
    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=800');

    // Check if the window was successfully opened
    if (printWindow) {
      // Get the HTML content of the design you want to print
      const contentToPrint = document.querySelector('.mb-2');
      //const contentToPrint = document.querySelector('.modal fade mt-1');

      // Check if the element was found before accessing outerHTML

      if (contentToPrint) {
        const contentClone = contentToPrint.cloneNode(true) as HTMLElement; // Cast to HTMLElement
        const printButton = contentClone.querySelector('.data-submit');
        const closeButton = contentClone.querySelector('.btn-outline-secondary');

        if (printButton) {
          printButton.remove();
        }
        if (closeButton) {
          closeButton.remove();
        }
        // Create the print document in the new window
        printWindow.document.open();
        printWindow.document.write('<html><head><title>Print</title></head><body>');
        printWindow.document.write(contentClone.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Wait for the content to load and then print
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();

          // Call your function after printing or closing the window
        };
      }
    }
  }

  onTimeChangeEvent() {
    this.timefilter = this.fltTime;
    if (this.timefilter == 9) {
      this.submitted = false;
      this.submitbtn = false;
      this.resetForm();
      $("#openClosejobdialoge").modal('toggle');
    }
    else {
      // this.getTicketTypefortoday(this.timefilter,this.startdate,this.enddate);
    }
  }

  isOptionDisabled(tickettypeId: string, rowIndex: number): boolean {
    const formArray = this.TicketBookingForm.get('tickets') as FormArray;
    const totalRows = formArray.length;

    for (let i = 0; i < totalRows; i++) {
      if (i !== rowIndex) {
        const rowControl = formArray.at(i);
        const ticketTypeControl = rowControl.get('tickettype');

        if (ticketTypeControl && ticketTypeControl.value === tickettypeId) {
          return true;
        }
      }
    }
    return false;
  }

  getTicketTypeName(ticketTypeId: number | null): string {
    if (ticketTypeId !== null) {
      const ticketType = this.tickettypeData.find((item: any) => item.tickettypeid === ticketTypeId);
      return ticketType ? ticketType.tickettypename : '';
    }
    return '';
  }

  getTicketPrice(ticketTypeId: number | null): number {
    if (ticketTypeId !== null) {
      const ticketType = this.tickettypeData.find((item: any) => item.tickettypeid === ticketTypeId);
      //return ticketType ? ticketType.ticketrate : 0;
      return ticketType ? ticketType.ticketrate : null;
    }
    return 0;
  }

  // Define a method to calculate the total
  calculateTotal(ticketTypeId: number | null, qty: number | null): number {
    let price = this.getTicketPrice(ticketTypeId);
    //return price * (qty || 0);
    if (this.selectedValues > 0) {
      price = 20;
    }
    return price * (qty || 0);
  }

  // Define a method to calculate the total of all totals
  calculateGrandTotal(): number {
    let grandTotal = 0;
    for (let i = 0; i < this.tickets.controls.length; i++) {
      const ticketTypeId = this.tickets.controls[i].get('tickettype')?.value;
      const qty = this.tickets.controls[i].get('ticketcounts')?.value;
      grandTotal += this.calculateTotal(ticketTypeId, qty);
    }
    this.total = grandTotal;
    return grandTotal;
  }

  getTicketType(search: string, pageIndex: number, pageSize: number) {
    //$("#loaderdiv").modal('show');
    this.ticketBookingService.getTicketBooking(search, this.pageIndex, this.pageSize).subscribe(res => {
      if (res.isSuccess) {
        if (res.data.length > 0) {

          this.tickettypeData = res.data;
          this.totalCount = res.data[0].totalCount;
        }
        else {
          this.tickettypeData = [];
        }
      }
      else {
        this.tickettypeData = [];
      }
      //$("#loaderdiv").modal('hide');
    },
      err => {
        //$("#loaderdiv").modal('hide');
      });
  }


  getTicketTypefortoday() {
    debugger
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.Date = `${day}-${month}-${year}`;

    this.ticketBookingService.getTicketBookingforToday(formattedDate.toString()).subscribe(res => {
      if (res.isSuccess) {
        if (res.data.length > 0) {
          debugger
          this.ticketbookingfortodayData = res.data;
          const timestamp = res.data[0].createddate;
          const dateAndTime = timestamp.slice(0, 16); // Extract "2023-09-19T15:49"
          const date = dateAndTime.slice(0, 10); // Extract "2023-09-19"
          const time = dateAndTime.slice(11); // Extract "15:49"
          const inputDate = new Date(date);
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const day = inputDate.getDate();
          const month = monthNames[inputDate.getMonth()];
          const year = inputDate.getFullYear();
          this.Date = `${day} ${month} ${year}`;
          //this.Date = date;
          debugger
          this.Time = time;
          this.totalCount = res.data[0].totalCount;
        }
        else {
          this.ticketbookingfortodayData = [];
        }
      }
      else {
        this.ticketbookingfortodayData = [];
      }
    },
      err => {
      });
  }

  getTicketTypefortodaybyId() {
    debugger
    this.ticketBookingService.getTicketBookingforTodaybyId(this.modifiedTicketUniqueId).subscribe(res => {
      if (res.isSuccess) {
        if (res.data.length > 0) {
          debugger
          this.IdWiseData = res.data;
          this.totalBill = res.data[0].total_rates;
        }
      }
      else {
        // this.ticketbookingfortodayData = [];
      }
    },
      err => {
      });
  }

  searchTicketBooking() {
    this.pageIndex = 1;
    this.getTicketType(this.search, this.pageIndex, this.pageSize);
  }

  changestatus(locationid: number, type: number, flag: boolean) {
    Swal.fire({
      title: 'Are you sure you want to change status?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        ///code here
        this.ticketBookingService.changeTicketTypetatus(locationid, type, !flag, this.userid).subscribe(
          data => {
            if (data.isSuccess) {
              this.getTicketType(this.search, this.pageIndex, this.pageSize);
              Swal.fire('Thank you...', data.returnMessage, 'success');
            }
            else {
              Swal.fire('', data.returnMessage, 'error');
            }
          },
          err => {
            Swal.fire('', err.error.message, 'error');
          }
        );
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        this.getTicketType(this.search, this.pageIndex, this.pageSize);
      }
    })
  }

  setTicketTypedata(data: any) {
    debugger
    this.submitbtn = false;
    this.modifiedTicketUniqueId = data.ticketuniqueid;
    this.getTicketTypefortodaybyId()
    $("#QR").modal('toggle');
  }


  deleteTicketType(tickettypeid: number) {
    Swal.fire({
      title: 'Are you sure you want to delete this record?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        ///code here
        this.ticketBookingService.changeTicketTypetatus(tickettypeid, 1, true, this.userid).subscribe(
          data => {
            if (data.isSuccess) {
              this.getTicketType(this.search, this.pageIndex, this.pageSize);
              Swal.fire('Thank you...', data.returnMessage, 'success');
            }
            else {
              Swal.fire('', data.returnMessage, 'error');
            }
          },
          err => {
            Swal.fire('', err.error.message, 'error');
          }
        );
      }
    })
  }

  resetForm() {
    this.TicketBookingForm = this.FB.group({
      tickets: this.FB.array([])
    })
    this.tickets.clear();
    this.selectedValues = 0;
    this.groupDisabled = false;
  }

  changePageSize() {
    this.pageIndex = 1;
    this.getTicketType(this.search, this.pageIndex, this.pageSize);
  }

  pageChangeEvent(event: number) {
    this.pageIndex = event;
    this.getTicketType(this.search, this.pageIndex, this.pageSize);
    //  this.getTicketType(this.search,this.pageIndex, this.pageSize,this.LocationSelected,this.DevisionSelected,this.jobcodeid);
  }

  generateNumbers(start: number, end: number): number[] {
    const numbers = [];
    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }
    return numbers;
  }


  selectedValues: number = 0;

  onChangeRadioButton(e: any) {
    debugger
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      // Add the value to the selectedValues array if checked
      // if (!this.selectedValues.includes(value)) {
      //   this.selectedValues.push(value);
      // }
      this.selectedValues = value;
      this.checked = true;
      // *ngIf="selectedValues" than 
      // [hidden]="tickettlst.tickettypename === 'NRI Male'"
    }
    else {
      // Remove the value from the selectedValues array if unchecked
      // const index = this.selectedValues.indexOf(value);
      // if (index !== -1) {
      //   this.selectedValues.splice(index, 1);
      // }
      this.checked = false;
      this.selectedValues = 0;
    }
    console.log(this.selectedValues);
  }

  async tickettypeOnchange(tickettype: any) {
    // let id = tickettype.value;
    // if (id === 1 || id === 2 || id === 3) {
    //   this.groupDisabled = false;
    // }
    // else {
    //   this.groupDisabled = true;
    // }
    let id = tickettype.value;
    const acceptableIds = [1, 2, 3];
    this.groupDisabled = !acceptableIds.includes(id);
  }

}


