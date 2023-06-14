import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProjectsComponent } from './projects/projects.component';
import { TeamComponent } from './team/team.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TasksComponent } from './tasks/tasks.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, SidebarComponent, ProjectsComponent, TeamComponent, TasksComponent],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
