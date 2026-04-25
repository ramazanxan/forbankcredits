from apps.scoring.logic import compute_score


def compute_roc_curve(labels, probs):
    paired = sorted(zip(probs, labels), key=lambda x: x[0], reverse=True)

    total_pos = sum(labels)
    total_neg = len(labels) - total_pos

    if total_pos == 0 or total_neg == 0:
        return {'fpr': [0.0, 1.0], 'tpr': [0.0, 1.0], 'thresholds': [1.0, 0.0]}

    fpr_list = [0.0]
    tpr_list = [0.0]
    thresholds_list = [1.0]

    tp = 0
    fp = 0
    prev_prob = None

    for prob, label in paired:
        if prev_prob is not None and prob != prev_prob:
            fpr_list.append(fp / total_neg)
            tpr_list.append(tp / total_pos)
            thresholds_list.append(prob)
        if label == 1:
            tp += 1
        else:
            fp += 1
        prev_prob = prob

    fpr_list.append(fp / total_neg)
    tpr_list.append(tp / total_pos)
    thresholds_list.append(0.0)

    return {'fpr': fpr_list, 'tpr': tpr_list, 'thresholds': thresholds_list}


def compute_pr_curve(labels, probs):
    paired = sorted(zip(probs, labels), key=lambda x: x[0], reverse=True)

    total_pos = sum(labels)
    if total_pos == 0:
        return {'precision': [1.0, 0.0], 'recall': [0.0, 1.0], 'thresholds': [1.0, 0.0]}

    precision_list = []
    recall_list = []
    thresholds_list = []

    tp = 0
    fp = 0

    for prob, label in paired:
        if label == 1:
            tp += 1
        else:
            fp += 1
        precision = tp / (tp + fp)
        recall = tp / total_pos
        precision_list.append(precision)
        recall_list.append(recall)
        thresholds_list.append(prob)

    return {'precision': precision_list, 'recall': recall_list, 'thresholds': thresholds_list}


def compute_auc(x_list, y_list):
    auc = 0.0
    for i in range(1, len(x_list)):
        dx = x_list[i] - x_list[i - 1]
        auc += dx * (y_list[i] + y_list[i - 1]) / 2
    return abs(auc)


def run_batch(rows):
    results = []
    labels = []
    probs = []
    has_labels = False

    approved_count = 0
    declined_count = 0

    for row in rows:
        row_data = dict(row)
        label = row_data.pop('label', None)

        result = compute_score(row_data)
        result['input'] = {k: row_data[k] for k in row_data}
        results.append(result)

        prob = result['probability_of_default']
        probs.append(prob)

        if label is not None:
            has_labels = True
            labels.append(label)

        if result['approved']:
            approved_count += 1
        else:
            declined_count += 1

    logs = [
        f'Processed {len(rows)} rows',
        f'Approved: {approved_count}, Declined: {declined_count}',
    ]

    metrics = None
    if has_labels and len(labels) == len(results):
        threshold = 0.4
        predicted = [1 if p >= threshold else 0 for p in probs]

        tp = sum(1 for l, p in zip(labels, predicted) if l == 1 and p == 1)
        tn = sum(1 for l, p in zip(labels, predicted) if l == 0 and p == 0)
        fp = sum(1 for l, p in zip(labels, predicted) if l == 0 and p == 1)
        fn = sum(1 for l, p in zip(labels, predicted) if l == 1 and p == 0)

        accuracy = (tp + tn) / len(labels) if labels else 0
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

        roc = compute_roc_curve(labels, probs)
        pr = compute_pr_curve(labels, probs)

        roc_auc = compute_auc(roc['fpr'], roc['tpr'])
        pr_auc = compute_auc(pr['recall'], pr['precision'])

        metrics = {
            'confusion_matrix': [[tn, fp], [fn, tp]],
            'accuracy': round(accuracy, 4),
            'f1': round(f1, 4),
            'roc_auc': round(roc_auc, 4),
            'pr_auc': round(pr_auc, 4),
            'roc_curve': roc,
            'pr_curve': pr,
        }

        logs.append(f'Accuracy: {round(accuracy * 100, 1)}%')
        logs.append(f'F1 Score: {round(f1, 4)}')

    return {
        'results': results,
        'metrics': metrics,
        'logs': logs,
    }
