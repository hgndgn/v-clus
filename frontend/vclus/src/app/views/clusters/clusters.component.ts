import { Component, Injector, OnInit } from '@angular/core';
import { VClusVpc, VCluster } from '@models/vclus';

import { ActiveTab } from '@models/helper_models';
import { ClusterService } from '@core/services';
import { DomSanitizer } from '@angular/platform-browser';
import { REQUEST_TIMEOUT } from '@constants/.ts';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.scss'],
})
export class ClustersComponent implements OnInit {
  activeTab: ActiveTab = ActiveTab.LIST;
  clusters: VCluster[] = [];

  refreshingCluster: boolean = true;
  showCreateClusterComponent = true;
  showJsonViewer: boolean = false;
  isLoading: boolean = true;
  hasError: boolean = false;

  currentCluster: VCluster;

  readonly clusterService: ClusterService;
  readonly sanitizer: DomSanitizer;
  readonly toastr: ToastrService;

  constructor(i: Injector) {
    this.clusterService = i.get(ClusterService);
    this.sanitizer = i.get(DomSanitizer);
    this.toastr = i.get(ToastrService);
  }

  ngOnInit() {
    this.activeTab = ActiveTab.LIST;
    this.showCreateClusterComponent = false;

    this.clusterService
      .fetchAll()
      .pipe(take(1))
      .subscribe(res => {
        if (res.status == 'error') {
          this.toastr.error('Cannot fetch clusters', 'An error occured');
          this.hasError = true;
        } else {
          this.clusters = res as VCluster[];
          this.clusters.forEach((n, i) => {
            n.vclusVpcs = JSON.parse(res[i].jsonVclusVpcs)
          })
              
          this.isLoading = false;
          this.refreshingCluster = false;
          this.showCreateClusterComponent = true;
        }
      });

    setTimeout(() => {
      if (this.isLoading) {
        this.hasError = true;
      }
    }, REQUEST_TIMEOUT);
  }

  openJsonViewerModal(cluster: VCluster) {
    this.currentCluster = cluster;
    this.showJsonViewer = true;
  }

  deleteCluster(cluster: any) {
    if (confirm('Do you really want to delete this cluster ?')) {
      const idx = this.clusters.findIndex(({ id }) => id === cluster.id);
      this.clusters.splice(idx, 1);

      this.clusterService
        .deleteCluster(cluster.id)
        .pipe(take(1))
        .subscribe((res: number) => {
          if (cluster.id == res) {
            this.toastr.success('Cluster deleted');
            this.ngOnInit();
          } else {
            this.clusters.splice(idx, 0, cluster);
            this.toastr.error(
              'Cluster could not be deleted',
              'An error occured',
            );
          }
        });
    }
  }

  // downloadJson(cluster: VCluster) {
  //   var json = JSON.stringify(cluster.vclusVpcs, null, 2);
  //   var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(json));
  //   return uri;
  // }

  viewRawJson(vclusVpcs: VClusVpc[]) {
    var jsonStr = JSON.stringify(vclusVpcs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  refreshClusters() {
    this.refreshingCluster = true;
    this.ngOnInit();
  }

  onClusterCreated() {
    this.refreshingCluster = true;
    this.ngOnInit();
  }
}
