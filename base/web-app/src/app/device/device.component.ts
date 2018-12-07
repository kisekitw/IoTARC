import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { DevicesService } from '../services/devices.service';
import { Params, ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { DataService } from '../services/data.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
	selector: 'app-device',
	templateUrl: './device.component.html',
	styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit, OnDestroy {
	device: any;
	data: Array<any>;
	toggleState: boolean = false;
	private subDevice: any;
	private subData: any;
	lastRecord: any;

	// line chart config 
	public lineChartOptions: any = {
		responsive: true,
		legend: {
			position: 'bottom',
		}, 
		hover: {
			mode: 'label'
		}, 
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Time'
				},
				ticks: {
					// autoSkip: false
				}
			}],
			yAxes: [{
				display: true,
				ticks: {
					beginAtZero: true,
					steps: 5,
					stepValue: 5
				}
			}]
		},
		title: {
			display: true,
			text: 'Temperature & Humidity vs. Time'
		}
	};

	public lineChartLegend: boolean = true;
	public lineChartType: string = 'line';
	public lineChartData: Array<any> = [];
	public lineChartLabels: Array<any> = [];

	constructor(private deviceService: DevicesService,
		private socketService: SocketService,
		private dataService: DataService,
		private route: ActivatedRoute,
		private notificationsService: NotificationsService) { }

	ngOnInit() {
		this.subDevice = this.route.params.subscribe((params) => {
			this.deviceService.getOne(params['id']).subscribe((response) => {
				this.device = response.json();
				this.getData();
				this.socketInit();
			});
		});
	}

	getData() {
		//console.log('Target device address', this.device.macAddress);
		this.dataService.get(this.device.macAddress).subscribe((response) => {
			this.data = response.json();
			//	console.log('getData mehtod result', this.data);
			this.genChart();
			this.lastRecord = this.data[0];
			if (this.lastRecord) {
				this.toggleState = this.lastRecord.data.l;
			}
		}, (err) => {
			console.log('Get data error', err);
			this.notificationsService.error('Get device data error. Check console for the error!');
		});
	}

	toggleChange(state) {
		// console.log('toggle fired!!!');
		// console.log('toggle device!!!', this.device);
		// console.log('toggle device!!!', this.lastRecord);
		let data = {
			macAddress: this.device.macAddress,
			data: {
				t: this.lastRecord.data.t,
				h: this.lastRecord.data.h,
				l: state ? 1 : 0
			},
			topic: 'led'
		}
		console.log('toggle data!!!', data);
		this.dataService.create(data).subscribe((resp) => {
			if (resp.json()._id) {
				this.notificationsService.success('Device Notified!');
			}
		}, (err) => {
			console.log(err);
			this.notificationsService.error('Device Notification Failed. Check console for the error!');
		})
	}

	socketInit() {
		this.subData = this.socketService.getData(this.device.macAddress).subscribe((data) => {
			if (this.data.length <= 0) return;
			this.data.splice(this.data.length - 1, 1); // remove the last record 
			this.data.push(data); // add the new one 
			this.lastRecord = data;
			this.genChart();
		});
	}

	ngOnDestroy() {
		this.subDevice.unsubscribe();
		this.subData ? this.subData.unsubscribe() : '';
	}

	genChart() {

		let data = this.data;
		let _dtArr: Array<any> = [];
		let _lblArr: Array<any> = [];

		let tmpArr: Array<any> = [];
		let humArr: Array<any> = [];

		for (var i = 0; i < data.length; i++) {
			let _d = data[i];
			tmpArr.push(_d.data.t);
			humArr.push(_d.data.h);
			console.log(this.formatDate(_d.createdAt));
			_lblArr.push(this.formatDate(_d.createdAt));

		}

		// reverse data to show the latest on the right side 
		tmpArr.reverse();
		humArr.reverse();
		_lblArr.reverse();

		console.log(_lblArr);

		_dtArr = [
			{
				data: tmpArr,
				label: 'Temperature'
			},
			{
				data: humArr,
				label: 'Humidity %'
			},
		]

		this.lineChartData = _dtArr;
		this.lineChartLabels = _lblArr;
	}

	private formatDate(originalTime) {
		//console.log(originalTime);
		var d = new Date(originalTime);
		// var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
		// 	d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

		var datestring = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		console.log(datestring);
		return datestring;
	}
}
