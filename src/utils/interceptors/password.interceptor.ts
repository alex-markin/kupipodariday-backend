import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.removePassword(data)));
  }

  private removePassword(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.removePassword(item));
    }

    if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (key === 'password') {
          delete data[key];
        } else if (typeof data[key] === 'object') {
          data[key] = this.removePassword(data[key]);
        }
      }
    }

    return data;
  }
}
