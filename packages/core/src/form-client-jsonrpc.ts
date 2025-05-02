import type {
  FormRequestTypes,
  FormNotificationTypes,
  FormMetaRequestTypes,
  FormContext,
  FormClient,
  FormEditor,
  FormSaveData,
  FormOnNotificationTypes,
  ValidationResult,
  FormActionArgs
} from '@axonivy/form-editor-protocol';
import {
  BaseRpcClient,
  urlBuilder,
  createMessageConnection,
  Emitter,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';

export class FormClientJsonRpc extends BaseRpcClient implements FormClient {
  protected onDataChangedEmitter = new Emitter<void>();
  protected onValidaitonChangedEmitter = new Emitter<void>();
  protected onSelectElementEmitter = new Emitter<string>();
  onDataChanged = this.onDataChangedEmitter.event;
  onValidationChanged = this.onValidaitonChangedEmitter.event;
  onSelectElement = this.onSelectElementEmitter.event;

  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.toDispose.push(this.onValidaitonChangedEmitter);
    this.toDispose.push(this.onSelectElementEmitter);
    this.onNotification('dataChanged', data => {
      this.onDataChangedEmitter.fire(data);
    });
    this.onNotification('validationChanged', data => {
      this.onValidaitonChangedEmitter.fire(data);
    });
    this.onNotification('selectElement', data => {
      this.onSelectElementEmitter.fire(data);
    });
  }

  initialize(context: FormContext): Promise<void> {
    return this.sendRequest('initialize', { ...context });
  }

  data(context: FormContext): Promise<FormEditor> {
    return this.sendRequest('data', { ...context });
  }

  saveData(saveData: FormSaveData): Promise<void> {
    return this.sendRequest('saveData', { ...saveData });
  }

  validate(context: FormContext): Promise<ValidationResult[]> {
    return this.sendRequest('validate', { ...context });
  }

  meta<TMeta extends keyof FormMetaRequestTypes>(
    path: TMeta,
    args: FormMetaRequestTypes[TMeta][0]
  ): Promise<FormMetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  action(action: FormActionArgs): void {
    this.sendNotification('action', action);
  }

  sendRequest<K extends keyof FormRequestTypes>(command: K, args: FormRequestTypes[K][0]): Promise<FormRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  sendNotification<K extends keyof FormNotificationTypes>(command: K, args: FormNotificationTypes[K]): Promise<void> {
    return this.connection.sendNotification(command, args);
  }

  onNotification<K extends keyof FormOnNotificationTypes>(kind: K, listener: (args: FormOnNotificationTypes[K]) => any): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-form-lsp');
  }

  public static async startClient(connection: Connection): Promise<FormClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<FormClientJsonRpc> {
    const client = new FormClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
