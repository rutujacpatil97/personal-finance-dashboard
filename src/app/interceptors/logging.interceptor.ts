import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const start = performance.now();

    return next.handle(req).pipe(
      finalize(() => {
        const time = performance.now() - start;
        console.info(`[HTTP] ${req.method} ${req.url} - ${time.toFixed(2)}ms`);
      })
    );
  }
}
