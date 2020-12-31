<?php

namespace App\Exceptions;

use CloudCreativity\LaravelJsonApi\Document\Error\Error;
use CloudCreativity\LaravelJsonApi\Exceptions\HandlesErrors;
use CloudCreativity\LaravelJsonApi\Exceptions\JsonApiException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
  use HandlesErrors;

  /**
   * A list of the exception types that are not reported.
   *
   * @var array
   */
  protected $dontReport = [JsonApiException::class];

  /**
   * A list of the inputs that are never flashed for validation exceptions.
   *
   * @var array
   */
  protected $dontFlash = ['password', 'password_confirmation'];

  /**
   * Report or log an exception.
   *
   * @param  \Throwable  $exception
   * @return void
   *
   * @throws \Exception
   */
  public function report(Throwable $exception)
  {
    parent::report($exception);
  }

  /**
   * Render an exception into an HTTP response.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Throwable  $exception
   * @return \Symfony\Component\HttpFoundation\Response
   *
   * @throws \Throwable
   */
  public function render($request, Throwable $exception)
  {
    if ($this->isJsonApi($request, $exception) && !$request->has('raw')) {
      if (!($exception instanceof JsonApiException)) {
        return $this->renderJsonApi(
          $request,
          new JsonApiException(
            Error::fromArray([
              'title' => $exception->getMessage(),
              'detail' => $exception->getTraceAsString(),
              'status' => $exception->getCode(),
              'meta' => [
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'previous' => $exception->getPrevious(),
              ],
            ])
          )
        );
      }
      return $this->renderJsonApi($request, $exception);
    }
    return parent::render($request, $exception);
  }

  protected function prepareException(Throwable $exception)
  {
    /* if ($exception instanceof JsonApiException) {
      return $this->prepareJsonApiException($exception);
    } */

    return parent::prepareException($exception);
  }
}
