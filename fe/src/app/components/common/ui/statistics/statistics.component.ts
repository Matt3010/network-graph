import {Component, Input} from '@angular/core';
import {FormStatistics} from "../../../../pages/write/write.component";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  @Input() statistics: FormStatistics | null = null;
}
